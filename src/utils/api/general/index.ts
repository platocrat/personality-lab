// Externals
import { NextResponse } from 'next/server'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  ddbDocClient, 
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES, 
} from '@/utils/aws'
import LibsodiumUtils from '@/utils/libsodium'



/**
 * @dev Encrypts an object's properties to create a new encrypted version of
 *      that is used to generate a unique `id`
 * @param obj 
 * @returns 
 */
export async function getEntryId(obj) {
  try {
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY
    )

    if (typeof SECRET_KEY === 'string') {
      const secretKey: Uint8Array = LibsodiumUtils.base64ToUint8Array(
        SECRET_KEY
      )

      // Encrypt object's properties
      const encryptedObj = await encryptObject(secretKey, obj, encryptionTransformFn)

      const hashLength = 64

      // Represent ID of the encrypted obj as a hash, in hexadecimal, to be
      // stored in a database
      const entryId = await LibsodiumUtils.genericHash(
        hashLength,
        JSON.stringify(encryptedObj),
        true // forces the return of ID as a hexadecimal string
      ) as string

      return entryId
    } else {
      throw new Error(
        `Error fetching ${AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY}`
      )
    }
  } catch (error: any) {
    console.error(error)
    throw new Error(`Error getting ID for object: `, error)
  }
}




const encryptObject = async (
  secretKey,
  obj,
  transformFn,
) => {
  const entries = await Promise.all(
    Object.entries(obj).map(async ([key, value]) => {
        const encryptedValue = await encryptionTransformFn(
          secretKey, 
          key, 
          value
        )

        return [key, encryptedValue]
      }
    )
  )

  return Object.fromEntries(entries)
}




// Example transformation function
const encryptionTransformFn = async (
  secretKey, 
  key, 
  value
) => {
  // Generic transformations here
  if (typeof value === 'string') {
    return await LibsodiumUtils.encryptData(value, secretKey)
  } else if (typeof value === 'number') {
    return LibsodiumUtils.encryptData(value.toString(), secretKey)
  } else if (typeof value === 'boolean') {
    return LibsodiumUtils.encryptData(`${ value }`, secretKey)
  } else {
    return value
  }
}