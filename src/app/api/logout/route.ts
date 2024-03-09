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



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    cookies().delete(COOKIE_NAME)

    return NextResponse.json(
      { message: 'User is logged out', },
      { status: 200, },
    )
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}