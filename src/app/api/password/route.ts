// Externals
import SSCrypto from '@/utils/crypto'
import { 
  pbkdf2Sync, 
  randomBytes, 
} from 'crypto'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(
  req: NextRequest, 
  res: NextResponse
) {
  if (req.method === 'POST') {
    try {
      const { password } = await req.json()

      const { hash, salt } = new SSCrypto().hashPassword(password)
      
      return NextResponse.json(
        { 
          salt,
          hash,
        },
        { status: 200 }
      )
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}