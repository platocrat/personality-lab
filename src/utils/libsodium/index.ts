import { 
  ready,
  to_hex,
  from_hex,
  to_base64,
  from_base64,
  randombytes_buf,
  base64_variants,
  crypto_pwhash_str,
  crypto_generichash,
  crypto_secretbox_easy,
  crypto_secretbox_keygen,
  crypto_secretbox_open_easy,
  crypto_secretbox_NONCEBYTES,
  crypto_pwhash_OPSLIMIT_MODERATE,
  crypto_pwhash_MEMLIMIT_MODERATE,
  crypto_pwhash_OPSLIMIT_SENSITIVE,
  crypto_pwhash_MEMLIMIT_SENSITIVE,
  crypto_pwhash_OPSLIMIT_INTERACTIVE,
  crypto_pwhash_MEMLIMIT_INTERACTIVE,
} from 'libsodium-wrappers-sumo'



/**
 * @dev Class to use symmetric encryption, which encrypts and decrypts data 
 * using the same secret key.
 * # Usage
 * ## Generating secret key
 * ```ts
 * const key = await generateKey()
 * // console.log(`key: `, key)
 * // console.log(`key: `, base64FromUint8Array(key))
 * const username = 'myUsername'
 * const encryptedUsername = await encryptData(username, key)
 * const decryptedUsername = new TextDecoder().decode(
 *   await decryptData(encryptedUsername, key)
 * )
 * 
 * console.log('Encrypted Username:', encryptedUsername)
 * console.log('Decrypted Username:', decryptedUsername)
 * ```
 */
export class LibsodiumUtils {
  static async hashPassword(
    password: string,
    encryptionStrength: 'low' | 'medium' | 'high',
    toHex?: boolean
  ) {
    await ready

    let memLimit = crypto_pwhash_MEMLIMIT_INTERACTIVE, 
      opsLimit = crypto_pwhash_OPSLIMIT_INTERACTIVE

    switch (encryptionStrength) {
      case 'high': 
        memLimit = crypto_pwhash_MEMLIMIT_SENSITIVE
        opsLimit = crypto_pwhash_OPSLIMIT_SENSITIVE
        break
      case 'medium': 
        memLimit = crypto_pwhash_MEMLIMIT_MODERATE
        opsLimit = crypto_pwhash_OPSLIMIT_MODERATE
        break
      default: 
        break
    }
        
    const hashedPassword = crypto_pwhash_str(password, opsLimit, memLimit)

    return toHex 
      ? await this.toHex(hashedPassword) 
      : hashedPassword
  }

  /**
   * Desired example usage
   * ```ts
   * const verifiedPassword = crypto_pwhash_str_verify(hashedPassword, password)
   * ```
   * where the `hashedPassword` is the taken from what is returned from 
   * `hashPassword`.
   */
  static async verifyPassword() {
    // INCOMPLETE
  }

  static async toHex(string: string): Promise<string> {
    await ready
    return to_hex(string)
  } 
  
  static async fromHex(string: string): Promise<string> {
    await ready
    return this.base64FromUint8Array(from_hex(string))
  } 

  static async generateKey(): Promise<Uint8Array> {
    await ready
    return crypto_secretbox_keygen()
  }
  
  static async genericHash(
    hashLength: number,
    message: string, 
    toHex?: true,
  ): Promise<Uint8Array | string> {
    await ready

    if (toHex) {
      const hash = crypto_generichash(hashLength, message)
      const hashString = this.base64FromUint8Array(hash)
      const hashInHex = this.toHex(hashString)
      return hashInHex
    } else {
      return crypto_generichash(hashLength, message)
    }
  }

  static async encryptData(message: string, key: Uint8Array): Promise<string> {
    await ready
    const nonce = randombytes_buf(crypto_secretbox_NONCEBYTES)
    const encryptedMessage = crypto_secretbox_easy(
      new TextEncoder().encode(message), 
      nonce, 
      key
    )

    const combined = new Uint8Array(nonce.length + encryptedMessage.length)
    combined.set(nonce)
    combined.set(encryptedMessage, nonce.length)

    return this.base64FromUint8Array(combined)
  }


  static async decryptData(combined: string, key: Uint8Array): Promise<string> {
    await ready
    const _combined = this.base64ToUint8Array(combined)
    const nonce = _combined.slice(0, crypto_secretbox_NONCEBYTES)
    const encryptedData = _combined.slice(crypto_secretbox_NONCEBYTES)

    try {
      const decryptedData = crypto_secretbox_open_easy(encryptedData, nonce, key)
      return new TextDecoder().decode(decryptedData)
    } catch (error) {
      throw new Error('Decryption failed')
    }
  }


  /**
   * @dev Takes a `base64String` encoded `string` and returns a `Uint8Array`.
   * @param base64String 
   * @returns Uint8Array
   */
  static base64ToUint8Array(base64String: string): Uint8Array {
    return from_base64(base64String, base64_variants.ORIGINAL)
  }


  /**
   * @dev Takes a `base64` encoded `Uint8Array` and returns a string.
   * @param base64 
   * @returns string
   */
  static base64FromUint8Array(base64: Uint8Array): string {
    return to_base64(base64, base64_variants.ORIGINAL)
  }
}


export default LibsodiumUtils