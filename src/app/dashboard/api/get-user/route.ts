// Externals
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { COOKIE_NAME, JWT_SECRET } from '@/utils/api'
import { verify } from 'jsonwebtoken'


export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  const cookieStore = cookies()

  const token = cookieStore.get(COOKIE_NAME)

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized', },
      { status: 401 }
    )
  } 

  const tokenValue = token?.value

  // Always check for the JWT secret
  const secret = JWT_SECRET

  try {
    verify(tokenValue, secret)

    return NextResponse.json(
      { user: 'Top secret user', },
      { status: 200, },
    )
  } catch (error: any) {
    // Something went wrong
    return NextResponse.json(
      { error: error, },
      { status: 400, },
    )
  }
}