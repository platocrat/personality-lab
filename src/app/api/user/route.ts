// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  ssmClient,
  COOKIE_NAME,
  LibsodiumUtils,
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

        return NextResponse.json(
          { message: message, },
          { status: 200, },
        )
      } catch (error: any) {
        // Something went wrong
        return NextResponse.json(
          { error: error, },
          { status: 400, },
        )
      }
    } else { // Return the error in the json of the `NextResponse`
      return JWT_SECRET as NextResponse<{ error: string }>
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}