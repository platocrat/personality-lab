// Externals
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { COOKIE_NAME } from '@/utils'



export async function DELETE(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'DELETE') {
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