// Externals
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { COOKIE_NAME, JWT_SECRET, MAX_AGE } from '@/utils/api'


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
      { message: 'User authenticated', },
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