import {
  BinaryLike,
  CipherKey,
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
} from 'crypto'



/**
 * @dev Server-side cryptography using Node.js's built-in `crypto` library
 */
class SSCrypto {
  private static readonly HASH_ALGORITHM = 'sha512'
  private static readonly ITERATIONS = 1_000_000
  private static readonly KEYLEN = 128
  private static readonly IV_LENGTH = 16
  private static readonly ENCRYPTION_KEY_LENGTH = 16
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-cbs'
  private static readonly HASHED_PASSWORD_ENCODING = 'hex'
  private static readonly SYMBOLS = `#@*+-_;,.?!()/{}&'`
  private static readonly CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  private static readonly LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
  private static readonly NUMBERS = '0123456789'
  private static readonly ALL_CHARS = SSCrypto.SYMBOLS 
    + SSCrypto.CAPITAL_LETTERS + SSCrypto.LOWERCASE_LETTERS + SSCrypto.NUMBERS

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
      this.iv
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
}

export default SSCrypto