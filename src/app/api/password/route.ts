// Externals
import { 
  ready, 
  crypto_pwhash_str,
  crypto_pwhash_str_verify,
  crypto_pwhash_MEMLIMIT_INTERACTIVE,
  crypto_pwhash_OPSLIMIT_INTERACTIVE,
} from 'libsodium-wrappers-sumo'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(
  req: NextRequest, 
  res: NextResponse
) {
  if (req.method === 'POST') {
    try {
      const { password } = await req.json()

      await ready
      
      let hashedPassword = crypto_pwhash_str(
        password,
        crypto_pwhash_OPSLIMIT_INTERACTIVE,
        crypto_pwhash_MEMLIMIT_INTERACTIVE
      )

      return NextResponse.json(
        { hashedPassword },
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