// Externals
import { CipherKey } from 'crypto'
// Locals
import {
  SSCrypto,
  LibsodiumUtils,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
} from '@/utils'



/**
 * @dev Encrypts an object's properties to create a new encrypted version of
 *      that is used to generate a unique `id`
 * @param obj 
 * @returns 
 */
export async function getEntryId(
  obj, 
  isLibsodium?: boolean
): Promise<string> {
  try {
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_SECRET_KEY
    )

    if (typeof SECRET_KEY === 'string') {
      let secretKey: Buffer | Uint8Array

      secretKey = isLibsodium 
        ? LibsodiumUtils.base64ToUint8Array(SECRET_KEY)
        : Buffer.from(SECRET_KEY, 'hex')

      // Encrypt object's properties
      const encryptedObj = await encryptObject(
        secretKey as Buffer, // Secret Key Cipher
        obj, 
        encryptionTransformFn
      )

      // Represent ID of the encrypted obj as a hash, in hexadecimal, to be
      // stored in a database
      const entryId = isLibsodium 
        ? (await LibsodiumUtils.genericHash(
              16, 
              JSON.stringify(encryptObject), 
              true
          )) as string
        : new SSCrypto().createHash({
          data: JSON.stringify(encryptedObj),
        })

      return entryId
    } else {
      throw new Error(
        `Error fetching ${AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_SECRET_KEY}`
      )
    }
  } catch (error: any) {
    console.error(error)
    throw new Error(`Error getting ID for object: `, error)
  }
}




const encryptObject = async (
  secretKey: CipherKey | Uint8Array,
  obj,
  transformFn,
  isLibsodium?: boolean
) => {
  const entries = await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
        const encryptedValue = await encryptionTransformFn(
          secretKey, 
          value,
          isLibsodium
        )

        return [key, encryptedValue]
      }
    )
  )

  return Object.fromEntries(entries)
}




// Example transformation function
const encryptionTransformFn = (
  secretKey: CipherKey | Uint8Array,
  value,
  isLibsodium?: boolean
) => {
  // Generic transformations here
  if (typeof value === 'string') {
    return isLibsodium 
      ? LibsodiumUtils.encrypt(value, secretKey as Uint8Array)
      : new SSCrypto().encrypt(value, secretKey as CipherKey) 
  } else if (typeof value === 'boolean') {
    const _value = `${ value }`

    return isLibsodium 
      ? LibsodiumUtils.encrypt(_value, secretKey as Uint8Array)
      : new SSCrypto().encrypt(_value, secretKey as CipherKey) 
  } else if (typeof value === 'number') {
      const _value = value.toString()

      return isLibsodium 
        ? LibsodiumUtils.encrypt(_value, secretKey as Uint8Array)
        : new SSCrypto().encrypt(_value, secretKey as CipherKey) 
  } else {
    return value
  }
}