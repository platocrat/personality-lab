// Externals
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { COOKIE_NAME } from '@/utils/api'



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    cookies().delete(COOKIE_NAME)

    return NextResponse.json(
      { message: 'User is logged out', },
      { status: 200, },
    )
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}