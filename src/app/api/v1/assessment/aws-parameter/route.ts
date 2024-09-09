// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  fetchAwsParameter
} from '@/utils'



export async function GET(
  req: NextRequest
) {
  if (req.method === 'GET') {
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized: Email query parameter is required!' },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const parameterName = req.nextUrl.searchParams.get('parameterName') ?? ''

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