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
  if (req.method === 'GET') {
    /**
     * @dev 1. Fetch secret that will be used for JWT verification
     */
    const input: GetParameterCommandInput = {
      Name: AWS_PARAMETER_NAMES.JWT_SECRET,
      WithDecryption: true,
    }

    const command = new GetParameterCommand(input)

    try {
      const response = await ssmClient.send(command)

      if (response.Parameter?.Value) {
        const secret = response.Parameter?.Value

        return NextResponse.json(
          { secret: secret },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: `${AWS_PARAMETER_NAMES.JWT_SECRET} parameter does not exist` },
          { status: 400 }
        )
      }
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: `Error! Something went wrong fetching ${AWS_PARAMETER_NAMES.JWT_SECRET}: ${error}`, },
        { status: 400, },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}