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
import { fetchAwsParameter, ssmClient } from '@/utils/aws/systems-manager'


export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const { parameterName } = await req.json()

    const parameter = await fetchAwsParameter(parameterName)

    if (typeof parameter === 'string') {
      return NextResponse.json(
        { secret: parameter },
        { status: 200 }
      )
    } else {
      return parameter as NextResponse<{ error: string }>
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}