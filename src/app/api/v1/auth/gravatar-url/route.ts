// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import crypto from 'crypto'



export async function GET(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<{ error: string }> | NextResponse<{ gravatarUrl: string }>> {
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

    const lowercasedEmail = email.trim().toLowerCase()
    const hash = crypto.createHash('sha256').update(lowercasedEmail).digest('hex')
    // Use Auth0's default Gravatar image
    const gravatarUrl = `https://s.gravatar.com/avatar/${ hash }?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2F${ email.slice(0, 2) }.png`
    
    return NextResponse.json(
      {
        gravatarUrl,
      },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}