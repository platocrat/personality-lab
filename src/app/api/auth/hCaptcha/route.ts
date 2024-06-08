// Externals
import { NextRequest, NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import { AWS_PARAMETER_NAMES, fetchAwsParameter } from '@/utils'


/**
 * @dev hCaptcha verification
 * @param req 
 * @param res 
 * @returns 
 */
export const POST = withApiAuthRequired(async function verifyHCaptcha(
  req: NextRequest
) {
  if (req.method === 'POST') {
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

    const { token } = await req.json()

    const METHOD = 'POST'
    const VERIFY_URL = 'https://api.hcaptcha.com/siteverify'

    const parameterName = AWS_PARAMETER_NAMES.H_CAPTCHA_SECRET_KEY
    const parameter = await fetchAwsParameter(parameterName)
    

    try {
      const response = await fetch(VERIFY_URL, {
        method: METHOD,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `response=${ token }&secret=${ parameter }`
      })

      const json = await response.json()

      if (json.success === true) {
        return NextResponse.json(
          { success: json.success },
          { status: 200 }
        )
      } else {
        // Something went wrong
        const error = json['error-codes']

        return NextResponse.json(
          { error: `Something went wrong with the response: ${ error }` },
          { status: 200 },
        )
      }
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error, },
        { status: 500, },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
})