// Externals
import { NextRequest, NextResponse } from 'next/server'


/**
 * @dev GET: caller's IP address
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const requestHeaders = req.headers
    const xForwardedFor = requestHeaders.get('x-forwarded-for')

    if (xForwardedFor) {
      return NextResponse.json(
        { 
          ipAddress: xForwardedFor,
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } else {
      // Something went wrong
      return NextResponse.json(
        { error: `Failed to get 'x-forwarded-for'.` },
        { 
          status: 500, 
          headers: {
            'Content-Type': 'application/json'
          }
        },
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