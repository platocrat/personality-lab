// Externals
import { cookies } from 'next/headers'
import { decode, verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  hasJWT,
  SSCrypto,
  CookieType,
  COOKIE_NAME,
  fetchAwsParameter,
  getDecryptedItems,
  AWS_PARAMETER_NAMES,
  EncryptedCookieFieldType,
} from '@/utils'


/**
 * Checks whether a cookie exists for the given user
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const getJWT = true
    const JWT = hasJWT(cookies, getJWT)

    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)


    if (typeof JWT_SECRET === 'string') {
      /**
       * @dev 2. Verify token using the JWT secret
       */
      try {
        verify(JWT, JWT_SECRET)

        const message = 'User authenticated'

        const decoded = decode(JWT)

        const encryptedEmail = (decoded as CookieType).email
        const encryptedUsername = (decoded as CookieType).username
        const encryptedIsAdmin = (decoded as CookieType).isAdmin
        const encryptedIsParticipant = (decoded as CookieType).isParticipant
        const encryptedTimestamp = (decoded as CookieType).timestamp

        const SECRET_KEY = await fetchAwsParameter(
          AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        )

        if (typeof SECRET_KEY === 'string') {
          const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')

          const toDecrypt: { [key: string]: EncryptedCookieFieldType }[] = [
            { email: encryptedEmail },
            { username: encryptedUsername },
            { isAdmin: encryptedIsAdmin },
            { isParticipant: encryptedIsParticipant },
            { timestamp: encryptedTimestamp },
          ]

          const decryptedItems = getDecryptedItems(
            toDecrypt,
            secretKeyCipher,
          )

          const user = { 
            ...decryptedItems,
            isAdmin: decryptedItems.isAdmin === 'true' ? true : false,
            isParticipant: decryptedItems.isParticipant === 'true' ? true : false,
          }

          console.log(
            `\n\n\n`, 
            `[${new Date().toLocaleString()} \ --filepath="src/app/api/auth/user/route.ts"]: server-side decrypted user object on to ensure that hackers aren't intercepting it and changing any of its values:`,
            '\n',
            user, 
            '\n\n\n'
          )


          return NextResponse.json(
            {
              user,
              message,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        }
      } catch (error: any) {
        // Something went wrong
        return NextResponse.json(
          { error: error },
          { 
            status: 500, 
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      }
    } else { // Return the error in the json of the `NextResponse`
      return JWT_SECRET as NextResponse<{ error: string }>
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { 
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}