import { 
  ready,
  to_base64,
  from_base64,
  randombytes_buf,
  base64_variants,
  crypto_secretbox_easy,
  crypto_secretbox_keygen,
  crypto_secretbox_open_easy,
  crypto_secretbox_NONCEBYTES,
} from 'libsodium-wrappers-sumo'



/**
 * @dev # Usage
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
class LibsodiumUtils {
  static async generateKey(): Promise<Uint8Array> {
    await ready
    return crypto_secretbox_keygen()
  }

  static async encryptData(message: string, key: Uint8Array): Promise<Uint8Array> {
    await ready
    const nonce = randombytes_buf(crypto_secretbox_NONCEBYTES)
    const encryptedMessage = crypto_secretbox_easy(new TextEncoder().encode(message), nonce, key)

    const combined = new Uint8Array(nonce.length + encryptedMessage.length)
    combined.set(nonce)
    combined.set(encryptedMessage, nonce.length)

    return combined
  }

  static async decryptData(combined: Uint8Array, key: Uint8Array): Promise<string> {
    await ready
    const nonce = combined.slice(0, crypto_secretbox_NONCEBYTES)
    const encryptedData = combined.slice(crypto_secretbox_NONCEBYTES)

    try {
      const decryptedData = crypto_secretbox_open_easy(encryptedData, nonce, key)
      return new TextDecoder().decode(decryptedData)
    } catch (error) {
      throw new Error('Decryption failed')
    }
  }

  static base64ToUint8Array(base64String: string): Uint8Array {
    return from_base64(base64String, base64_variants.ORIGINAL)
  }

  static base64FromUint8Array(base64: Uint8Array): string {
    return to_base64(base64, base64_variants.ORIGINAL)
  }
}

export default LibsodiumUtils