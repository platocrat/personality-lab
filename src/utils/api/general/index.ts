// Externals
import { CipherKey } from 'crypto'
import { NextResponse } from 'next/server'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  SSCrypto,
  ddbDocClient, 
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev Encrypts an object's properties to create a new encrypted version of
 *      that is used to generate a unique `id`
 * @param obj 
 * @returns 
 */
export async function getEntryId(obj) {
  try {
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_SECRET_KEY
    )

    if (typeof SECRET_KEY === 'string') {
      const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')

      // Encrypt object's properties
      const encryptedObj = await encryptObject(
        secretKeyCipher, 
        obj, 
        encryptionTransformFn
      )

      // Represent ID of the encrypted obj as a hash, in hexadecimal, to be
      // stored in a database
      const entryId = new SSCrypto().createHash(JSON.stringify(encryptedObj))
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
  secretKey: CipherKey,
  obj,
  transformFn,
) => {
  const entries = await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
        const encryptedValue = await encryptionTransformFn(secretKey, value)

        return [key, encryptedValue]
      }
    )
  )

  return Object.fromEntries(entries)
}




// Example transformation function
const encryptionTransformFn = (
  secretKey: CipherKey, 
  value
) => {
  // Generic transformations here
  if (typeof value === 'string') {
    return new SSCrypto().encrypt(value, secretKey)
  } else if (typeof value === 'number') {
    return new SSCrypto().encrypt(value.toString(), secretKey)
  } else if (typeof value === 'boolean') {
    return new SSCrypto().encrypt(`${ value }`, secretKey)
  } else {
    return value
  }
}