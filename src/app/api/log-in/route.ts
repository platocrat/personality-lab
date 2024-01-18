// Externals
import { 
  crypto_pwhash_str, 
  crypto_pwhash_str_verify,
  crypto_pwhash_OPSLIMIT_INTERACTIVE, 
  crypto_pwhash_MEMLIMIT_INTERACTIVE 
} from 'libsodium-wrappers-sumo'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'
import { BESSI_accounts } from '../check-email/route'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
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

        console.log(`verifiedPassword: `, verifiedPassword)
        console.log(`verifiedUsername: `, verifiedUsername)

        if (verifiedUsername && verifiedPassword) {
          const key = username
          const value = `User '${username}' last autheticated on ${new Date()}`
          
          cookies().set(key, value, { 
            secure: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
          })

          const cookieValue = cookies().get(key)

          console.log(`cookieValue: `, cookieValue)

          return NextResponse.json(
            { message: 'Verified email, username, and password' },
            { status: 200 },
          )
        } else if (verifiedUsername && !verifiedPassword) {
          return NextResponse.json(
            { message: 'Incorrect password' },
            { status: 200 },
          )  
        } else if (!verifiedUsername && verifiedPassword) {
          return NextResponse.json(
            { message: 'Incorrect username' },
            { status: 200 },
          )  
        } else {
          return NextResponse.json(
            { message: 'Incorrect username and password' },
            { status: 200 },
          )  
        }
      } else {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 400 },
        )
      }
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
