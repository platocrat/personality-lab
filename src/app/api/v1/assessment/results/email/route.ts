// Externals
import { NextRequest, NextResponse } from 'next/server'
// Local



/**
 * @todo Finish this route to send an email of the user's survey/assessment
 *       results to the user's logged in email address.
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    // 1. Compose email

    // 2. Send email

    // 3. Compose success message
    const message = `Successfully sent email to the user's logged in email address.`

    // 4. Return Next.js response
    return NextResponse.json(
      {
        message,
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { 
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}