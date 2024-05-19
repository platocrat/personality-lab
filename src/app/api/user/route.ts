// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { decode, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  ssmClient,
  CookieType,
  COOKIE_NAME,
  LibsodiumUtils,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES,
  getCookieSecretKey,
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

        const SECRET_KEY = await fetchAwsParameter(
          AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        )

        if (typeof SECRET_KEY === 'string') {
          const secretKeyUint8Array = LibsodiumUtils.base64ToUint8Array(
            SECRET_KEY
          )

          const email = await LibsodiumUtils.decryptData(
            encryptedEmail, 
            secretKeyUint8Array
          )
          const username = await LibsodiumUtils.decryptData(
            encryptedUsername, 
            secretKeyUint8Array
          )
          const isAdmin = await LibsodiumUtils.decryptData(
            `${ encryptedIsAdmin }`, 
            secretKeyUint8Array
          )

          const user = { email, username, isAdmin }


          return NextResponse.json(
            {
              user,
              message: message,
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
        console.log(`error: `, error.message)
        // Something went wrong
        return NextResponse.json(
          { error: error, },
          { 
            status: 400, 
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