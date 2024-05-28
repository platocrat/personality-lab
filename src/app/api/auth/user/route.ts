// Externals
import { cookies } from 'next/headers'
import { decode, verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  SSCrypto,
  CookieType,
  COOKIE_NAME,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
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
    /**
     * @dev 1. Check if a cookie exists for the user
     */
    const cookieStore = cookies()

    const token = cookieStore.get(COOKIE_NAME)

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized', },
        { status: 401 }
      )
    } 

    const tokenValue = token?.value

    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)


    if (typeof JWT_SECRET === 'string') {
      /**
       * @dev 2. Verify token using the JWT secret
       */
      try {
        verify(tokenValue, JWT_SECRET)

        const message = 'User authenticated'

        const decoded = decode(tokenValue)

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

          const email = new SSCrypto().decrypt(
            encryptedEmail.encryptedData,
            secretKeyCipher,
            encryptedEmail.iv
          )
          const username = new SSCrypto().decrypt(
            encryptedUsername.encryptedData,
            secretKeyCipher,
            encryptedUsername.iv
          )
          const isAdmin = new SSCrypto().decrypt(
            encryptedIsAdmin.encryptedData,
            secretKeyCipher,
            encryptedIsAdmin.iv
          ) === 'true' ? true : false
          const isParticipant = new SSCrypto().decrypt(
            encryptedIsParticipant.encryptedData,
            secretKeyCipher,
            encryptedIsParticipant.iv
          ) === 'true' ? true : false

          const timestamp = new SSCrypto().decrypt(
            encryptedTimestamp.encryptedData,
            secretKeyCipher,
            encryptedTimestamp.iv
          )


          const user = { 
            email, 
            username, 
            isAdmin,
            isParticipant,
            timestamp,
          }


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
          { error: error, },
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