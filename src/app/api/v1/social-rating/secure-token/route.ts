// Externals
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  SSCrypto, 
  validateToken,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES, 
  generateSecureToken,
} from '@/utils'



/**
 * @dev POST: validates the secure token using the `sessionId` and `sessionPin`.
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { 
      token,
      sessionId, 
      sessionPin,
    } = await req.json()

    if (sessionId && sessionPin && token) {
      const SECRET_KEY = await fetchAwsParameter(
        AWS_PARAMETER_NAMES.GAME_SESSION_SECURE_TOKEN_SECRET_KEY
      )

      if (typeof SECRET_KEY === 'string') {
        const isValidToken = validateToken(
          sessionPin, 
          sessionId, 
          token,
          SECRET_KEY
        )

        return NextResponse.json(
          {
            isValidToken,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ) 
      } else {
        // Return the error in the json of the `NextResponse`
        return SECRET_KEY as NextResponse<{ error: string }>
      }
    } else {
      const error = `Unauthorized: 'token', 'sessionId', and 'sessionPin' are required in the request's JSON body!`

      return NextResponse.json(
        { error },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}



/**
 * @dev GET: secure token from `sessionId` and `sessionPin` that is used to 
 *           validate the `sessionPin` via using game session's QR code.
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    const sessionPin = req.nextUrl.searchParams.get('sessionPin')

    if (sessionId && sessionPin) {
      const SECRET_KEY = await fetchAwsParameter(
        AWS_PARAMETER_NAMES.GAME_SESSION_SECURE_TOKEN_SECRET_KEY
      )

      if (typeof SECRET_KEY === 'string') {
        const secureToken = generateSecureToken(
          sessionPin, 
          sessionId, 
          SECRET_KEY
        )

        return NextResponse.json(
          {
            secureToken
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ) 
      } else {
        // Return the error in the json of the `NextResponse`
        return SECRET_KEY as NextResponse<{ error: string }>
      }
    } else {
      const error = `Unauthorized: 'sessionId' and 'sessionPin' query parameters are required!`

      return NextResponse.json(
        { error },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}