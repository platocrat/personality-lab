// Externals
import { NextResponse } from 'next/server'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient, DYNAMODB_TABLE_NAMES } from '@/utils/aws'
import LibsodiumUtils from '@/utils/libsodium'


const encryptObject = async (
  secretKey,
  obj,
  transformFn,
) => {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [
        key, 
        encryptionTransformFn(
          secretKey, 
          key, 
          value
        )
      ]
    )
  )
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