// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { AWS_PARAMETER_NAMES, fetchAwsParameter } from '@/utils'


/**
 * @dev hCaptcha verification
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
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

      const data = await response.json()

      if (data.success === true) {
        return NextResponse.json(
          { success: data.success },
          { status: 200 }
        )
      } else {
        // Something went wrong
        const error = data['error-codes']

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
}