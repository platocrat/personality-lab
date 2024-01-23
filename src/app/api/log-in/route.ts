// Externals
import { 
  crypto_pwhash_str, 
  crypto_pwhash_str_verify,
  crypto_pwhash_OPSLIMIT_INTERACTIVE, 
  crypto_pwhash_MEMLIMIT_INTERACTIVE 
} from 'libsodium-wrappers-sumo'
import { serialize } from 'cookie'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'
import { BESSI_accounts } from '../check-email/route'
import { COOKIE_NAME, JWT_SECRET, MAX_AGE } from '@/utils/api'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()     

    const input: QueryCommandInput = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      KeyConditionExpression: 'email = :emailValue',
      ExpressionAttributeValues: {
        ':emailValue': email,
      }
    }

    const command = new QueryCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && (response.Items[0] as BESSI_accounts).password) {
        const storedUsername = (response.Items[0] as BESSI_accounts).username
        const hashedPassword = (response.Items[0] as BESSI_accounts).password

        const verifiedUsername = storedUsername === username
        const verifiedPassword = crypto_pwhash_str_verify(hashedPassword, password)

        if (verifiedUsername && verifiedPassword) {
          const key = username
          const value = `User '${username}' last autheticated on ${new Date()}`

          /**
           * @todo Fetch the JWT secret from a secure source
           */
          const secret = JWT_SECRET

          const token = sign(
            { email, username, password },
            secret,
            { expiresIn: MAX_AGE }
          )

          const serializedCookieWithToken = serialize(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NEXT_NODE_ENV ? false : true,
            sameSite: 'strict',
            path: '/',
          })

          // Format cookie to proper format for verification (done later)
          cookies().set(
            COOKIE_NAME,
            serializedCookieWithToken.slice(
              serializedCookieWithToken.indexOf('=') + 1,
              serializedCookieWithToken.indexOf(';')
            )
          )

          return NextResponse.json(
            { message: 'Verified email, username, and password' },
            { 
              status: 200,
              headers: { 'Set-Cookie': serializedCookieWithToken }
            },
          )
        } else if (verifiedUsername && !verifiedPassword) {
          return NextResponse.json(
            { message: 'Invalid password' },
            { status: 200 },
          )  
        } else if (!verifiedUsername && verifiedPassword) {
          return NextResponse.json(
            { message: 'Invalid username' },
            { status: 200 },
          )  
        } else {
          return NextResponse.json(
            { message: 'Invalid username and password' },
            { status: 200 },
          )  
        }
      } else {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 200 },
        )
      }
    } catch (error: any) {
      if (error.message === `Cannot read properties of undefined (reading 'password')`) {
        return NextResponse.json(
          { message: 'Email not found' },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { error: error.message },
          { status: 500 },
        )
      }
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}
