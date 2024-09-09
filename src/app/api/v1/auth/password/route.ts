// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { SSCrypto } from '@/utils'



export async function POST(
  req: NextRequest, 
  res: NextResponse
) {
  if (req.method === 'POST') {
    const { password } = await req.json()

    const { hash, salt } = new SSCrypto().hashPassword(password)
    
    return NextResponse.json(
      { 
        salt,
        hash,
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