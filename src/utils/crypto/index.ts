import {
  subtle,
  CipherKey,
  pbkdf2Sync,
  scryptSync,
  randomBytes,
  createHash,
  BinaryLike,
  createCipheriv,
  createDecipheriv,
} from 'crypto'



/**
 * @dev Server-side cryptography using Node.js's built-in `crypto` library
 */
export class SSCrypto {
  private static readonly HASH_ALGORITHM = 'sha512'
  private static readonly ITERATIONS = 1_000_000
  private static readonly KEYLEN = 128
  private static readonly IV_LENGTH = 16
  private static readonly HASH_KEY_LENGTH = 16
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-cbc'
  private static readonly ENCRYPTION_KEY_LENGTH = 32
  private static readonly HASHED_PASSWORD_ENCODING = 'hex'
  // private static readonly SYMBOLS = `#@*+-_;,.?!()/{}&'`
  // private static readonly CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  // private static readonly LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
  private static readonly NUMBERS = '0123456789'
  // private static readonly ALL_CHARS = SSCrypto.SYMBOLS + SSCrypto.CAPITAL_LETTERS + SSCrypto.LOWERCASE_LETTERS + SSCrypto.NUMBERS

    private iv: Buffer
    private salt: string
    // private key: string
  

  constructor () {
    this.iv = randomBytes(SSCrypto.IV_LENGTH)
    this.salt = randomBytes(16).toString(SSCrypto.HASHED_PASSWORD_ENCODING)
    // this.key = scryptSync(
    //   'password',
    //   this.salt,
    //   SSCrypto.ENCRYPTION_KEY_LENGTH,
    //   {
    //     N: 16384, // CPU/memory cost, i.e. level of brute-force attack reststance
    //     r: 8, // block size (higher values are more secure)
    //     p: 1, // level of resistance to paralel attacks
    //     maxmem: 32 * 1024 * 1024, // limits the amount of memory used
    //   }
    // )
  }

  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private static getRandomChar(chars: string): string {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  public hashPassword(
    password: string,
    salt?: string,
  ): { salt: string, hash: string } {
    let hashedPassword = pbkdf2Sync(
      password,
      salt ?? this.salt,
      SSCrypto.ITERATIONS,
      SSCrypto.KEYLEN,
      SSCrypto.HASH_ALGORITHM
    ).toString(SSCrypto.HASHED_PASSWORD_ENCODING)

    return { 
      salt: salt ?? this.salt, 
      hash: hashedPassword 
    }
  }

  public verifyPassword(
    password: string, 
    hash: string,
    salt: string
  ): boolean {
    const hashToVerify = pbkdf2Sync(
      password,
      salt,
      SSCrypto.ITERATIONS,
      SSCrypto.KEYLEN,
      SSCrypto.HASH_ALGORITHM
    ).toString(SSCrypto.HASHED_PASSWORD_ENCODING)

    return hash === hashToVerify
  }

  public encrypt(
    data: any,
    key: CipherKey,
  ): { iv: string, encryptedData: string } {
    const cipher = createCipheriv(
      SSCrypto.ENCRYPTION_ALGORITHM, 
      key,
      this.iv,
    )

    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex')
    encryptedData += cipher.final('hex')

    return {
      iv: this.iv.toString('hex'),
      encryptedData
    }
  }

  public decrypt(encryptedData: string, key: CipherKey, iv: string): any {
    const decipher = createDecipheriv(
      SSCrypto.ENCRYPTION_ALGORITHM, 
      key,
      Buffer.from(iv, 'hex')
    )

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
    decryptedData += decipher.final('utf8')

    return JSON.parse(decryptedData)
  }


  // Function to create a hash
  public createHash({
    data,
    algorithm,
    outputLength,
  }: { 
    data: any
    algorithm?: string
    outputLength?: number
  }): string {
    // Create a hash object
    const hash = createHash(
      algorithm ?? 'shake256', 
      { 
        outputLength: outputLength ?? SSCrypto.HASH_KEY_LENGTH 
      }
    )

    // Update the hash with the data
    hash.update(data)

    // Calculate the hash digest (output) in hex format
    return hash.digest('hex')
  }


  public async generateNewSecretKeys(): Promise<{
    COOKIE_ENCRYPTION_SECRET_KEY: string
    RESULTS_ENCRYPTION_SECRET_KEY: string
    SHARE_RESULTS_ENCRYPTION_SECRET_KEY: string
  }> {
    let newSecretKeys = { 
      COOKIE_ENCRYPTION_SECRET_KEY: '',
      RESULTS_ENCRYPTION_SECRET_KEY: '',
      SHARE_RESULTS_ENCRYPTION_SECRET_KEY: '',
    }

    const objectKeys = [
      `COOKIE_ENCRYPTION_SECRET_KEY`,
      `RESULTS_ENCRYPTION_SECRET_KEY`,
      `SHARE_RESULTS_ENCRYPTION_SECRET_KEY`
    ]

    objectKeys.forEach((objKey: string): void => {
      const secretKey = randomBytes(SSCrypto.ENCRYPTION_KEY_LENGTH)
      newSecretKeys[objKey] = secretKey.toString('hex')
    })

    return newSecretKeys
  }
}




export class CSCrypto {
  static arrayBufferToBase64(buffer: ArrayBufferLike): string {
    const uint8Array = new Uint8Array(buffer)
    const binaryString = String.fromCharCode(...uint8Array)
    return Buffer.from(binaryString, 'binary').toString('hex')
  }


  static base64ToArrayBuffer(base64: string): ArrayBufferLike {
    const binaryString = Buffer.from(base64, 'hex').toString('binary')
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes.buffer
  }



  static async compressAndEncodeToBase64(buffer: ArrayBufferLike): Promise<string> {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer))
        controller.close()
      }
    })

    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'))
    const reader = compressedStream.getReader()
    const chunks: any = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const compressed = new Uint8Array(
      chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
    )

    return this.arrayBufferToBase64(compressed.buffer)
  }



  static async decodeAndDecompressFromBase64(encoded): Promise<ArrayBufferLike> {
    const compressed = new Uint8Array(CSCrypto.base64ToArrayBuffer(encoded))

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(compressed)
        controller.close()
      }
    })

    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
    const reader = decompressedStream.getReader()
    const chunks: any = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    const decompressed = new Uint8Array(chunks.reduce(
      (acc, chunk) => acc.concat(Array.from(chunk)), [])
    )

    return decompressed.buffer
  }



  static compareArrayBuffers(
    buffer1: ArrayBufferLike, 
    buffer2: ArrayBufferLike
  ): boolean {
    if (buffer1.byteLength !== buffer2.byteLength) return false

    const view1 = new Uint8Array(buffer1)
    const view2 = new Uint8Array(buffer2)

    for (let i = 0; i < buffer1.byteLength; i++) {
      if (view1[i] !== view2[i]) {
        return false
      }
    }

    return true
  }


  /**
   * @dev You cannot replace `crypto.subtle` with an import of `subtle`;
   *      otherwise, you will get an error
   * ### To decompress
   * 
   * ```ts
   * const decompressed = await decodeAndDecompressFromBase64(
   *   compressedAndBase64Encoded
   * )
   * // OPTIONAL: Confirm that the decryption the file can be successfully 
   * //           decompressed
   * console.log(
   *   `decompressed === encrypted: `,
   *   compareArrayBuffers(decompressed, encrypted)
   * )
   * ```
   * 
   * ### Steps to generate a random initialization vector and asymmetric key
   * You will need an `iv` and `key` to encrypt the `str` argument:
   *
   * ```ts
   * // 1. Set the size of the key to 16 bytes
   * const bytesSize = new Uint8Array(16)
   * // 2. Create an initialization vector of 128 bit-length
   * const iv = crypto.getRandomValues(bytesSize).toString()
   * console.log(`iv: `, iv)
   * 
   * // 3. Generate a new asymmetric key
   * const key = await crypto.subtle.generateKey(
   *   {
   *     name: 'AES-GCM',
   *     length: 128
   *   },
   *   true,
   *   ['encrypt', 'decrypt']
   * )
   * // 4. Export the `CryptoKey`
   * const jwk = await crypto.subtle.exportKey('jwk', key) 
   * const stringSerializedJwk = JSON.stringify(jwk)
   * console.log(`stringSerializedJwk: `, stringSerializedJwk)
   * ```
   */
  static async encryptThenEncode(str: string): Promise<string> {
    const jwk = JSON.parse(process.env.NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_KEY)
    const iv = Buffer.from(process.env.NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_IV)
    const encode = (str: string): Uint8Array => new TextEncoder().encode(str)

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    )

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encode(str)
    )

    const encryptedBase64 = CSCrypto.arrayBufferToBase64(encrypted)
    const compressed = await CSCrypto.compressAndEncodeToBase64(encrypted)

    return compressed
  }



  static async decodeAndDecrypt(encoded: string): Promise<string> {
    const jwk = JSON.parse(process.env.NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_KEY)
    const iv = Buffer.from(process.env.NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_IV)

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'AES-GCM', length: 128 },
      true,
      ['encrypt', 'decrypt']
    )

    const decompressed = await CSCrypto.decodeAndDecompressFromBase64(encoded)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      decompressed
    )

    return new TextDecoder().decode(decrypted)
  }
}