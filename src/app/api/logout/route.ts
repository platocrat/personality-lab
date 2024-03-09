// Externals
import {
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { AWS_PARAMETER_NAMES } from '@/utils'
import { COOKIE_NAME, MAX_AGE } from '@/utils/api'
import { LibsodiumUtils } from '@/utils/libsodium'
import { fetchAwsParameter, ssmClient } from '@/utils/aws/systems-manager'



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
        /**
         * @dev 3. Delete previous cookie
         */
        cookies().delete(COOKIE_NAME)

        return NextResponse.json(
          { message: 'User authenticated', },
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