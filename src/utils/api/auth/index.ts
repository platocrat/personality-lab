// Externals
import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
// Locals
import { 
  MAX_AGE,
  SSCrypto,
  COOKIE_NAME,
  ACCOUNT_ADMINS,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES,
  PARTICIPANT__DYNAMODB,
  EncryptedCookieFieldType,
  HASHED_PASSWORD__DYNAMODB,
} from '@/utils'


type EncryptedItem = { 
  iv: string
  encryptedData: string 
}

export type EncryptedItems = { 
  [key: string]: {
    iv: string
    encryptedData: string
  }
}



export function getEncryptedItems(
  toEncrypt: { [key: string]: string }[],
  secretKeyCipher: Buffer
): EncryptedItems {
  let encryptedItems: EncryptedItems = {}

  toEncrypt.forEach((item: { [key: string]: string }, i: number): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const encryptedItem = new SSCrypto().encrypt(
      value,
      secretKeyCipher
    )

    encryptedItems[key] = encryptedItem
  })

  return encryptedItems
}


export function getDecryptedItems(
  toDecrypt: { [key: string]: EncryptedCookieFieldType }[],
  secretKeyCipher: Buffer
): { [key: string]: string } {
  let decryptedItems: { [key: string]: string } = {}

  toDecrypt.forEach((
    item: { [key: string]: EncryptedCookieFieldType }, 
    i: number
  ): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const decryptedItem = new SSCrypto().decrypt(
      value.encryptedData,
      secretKeyCipher,
      value.iv,
    )

    decryptedItems[key] = decryptedItem
  })

  return decryptedItems
}