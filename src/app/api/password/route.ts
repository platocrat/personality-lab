// Externals
import { 
  ready, 
  crypto_pwhash_str,
  crypto_pwhash_MEMLIMIT_SENSITIVE,
  crypto_pwhash_OPSLIMIT_SENSITIVE,
} from 'libsodium-wrappers-sumo'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
      const { password } = await req.json()

      await ready
      
      let hashedPassword = crypto_pwhash_str(
        password,
        crypto_pwhash_OPSLIMIT_SENSITIVE,
        crypto_pwhash_MEMLIMIT_SENSITIVE
      )

      hashedPassword = hashedPassword.slice(
        hashedPassword.indexOf('p=1')
      ).split('p=1$')[1]

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