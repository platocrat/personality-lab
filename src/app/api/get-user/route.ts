// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { AWS_PARAMETER_NAMES } from '@/utils'
import { COOKIE_NAME, MAX_AGE } from '@/utils/api'
import { ssmClient } from '@/utils/aws/systems-manager'


export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
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

  /**
   * @dev 2. Fetch secret that will be used for JWT verification
   */
  let secret = 'null'

  const input: GetParameterCommandInput = {
    Name: AWS_PARAMETER_NAMES.JWT_SECRET,
    WithDecryption: true,
  }

  const command = new GetParameterCommand(input)

  try {
    const response = await ssmClient.send(command)

    if (response.Parameter?.Value) {
      secret = response.Parameter?.Value
    } else {
      return NextResponse.json(
        { error: `${AWS_PARAMETER_NAMES.JWT_SECRET} parameter does not exist` },
        { status: 400 }
      )
    }
  } catch (error: any) {
    // Something went wrong
    return NextResponse.json(
      { error: `Error! Something went wrong fetching ${ AWS_PARAMETER_NAMES.JWT_SECRET }: ${error}`, },
      { status: 400, },
    )
  }

  /**
   * @dev 3. Verify token using the JWT secret
   */
  try {
    verify(tokenValue, secret)

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
}