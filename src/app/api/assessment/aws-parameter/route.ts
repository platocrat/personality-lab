// Externals
import {
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm'
import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  ssmClient,
  COOKIE_NAME, 
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES,
} from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
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