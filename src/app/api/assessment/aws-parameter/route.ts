// Externals
import { NextRequest, NextResponse } from 'next/server'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
// Locals
import {
  fetchAwsParameter
} from '@/utils'



export const GET = withApiAuthRequired(async function getAWSParameter(
  req: NextRequest
) {
  if (req.method === 'GET') {
    const res = new NextResponse()

    // Auth0
    const session = await getSession(req, res)
    const user = session?.user

    if (!user) {
      const message = `Unauthorized: Auth0 found no 'user' for their session.`
      return NextResponse.json(
        { message },
        {
          status: 401,
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
})