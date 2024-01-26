// Externals
import { 
  GetParameterCommand,
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { 
  crypto_pwhash_str, 
  crypto_pwhash_str_verify,
  crypto_pwhash_OPSLIMIT_INTERACTIVE, 
  crypto_pwhash_MEMLIMIT_INTERACTIVE 
} from 'libsodium-wrappers-sumo'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { COOKIE_NAME, MAX_AGE } from '@/utils/api'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_accounts } from '../check-email/route'
import { ssmClient } from '@/utils/aws/systems-manager'
import { AWS_PARAMETER_NAMES, BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'



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

    /**
     * @dev 1. Verify username and password
     */
    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && (response.Items[0] as BESSI_accounts).password) {
        const storedUsername = (response.Items[0] as BESSI_accounts).username
        const hashedPassword = (response.Items[0] as BESSI_accounts).password

        const verifiedUsername = storedUsername === username
        const verifiedPassword = crypto_pwhash_str_verify(hashedPassword, password)

        if (verifiedUsername && verifiedPassword) {
          /**
           * @dev 2. Fetch the JWT secret from AWS Parameter Store
           */
          let secret = 'null'
          
          const input: GetParameterCommandInput = {
            Name: AWS_PARAMETER_NAMES.JWT_SECRET,
            WithDecryption: true,
          }

          const command = new GetParameterCommand(input)

          try {
            const response = await ssmClient.send(command)

            if (response.Parameter?.Value) {
              secret = response.Parameter?.Value
            } else {
              return NextResponse.json(
                { error: `${ AWS_PARAMETER_NAMES.JWT_SECRET } parameter does not exist` },
                { status: 400 }
              )
            }
          } catch (error: any) {
            // Something went wrong
            return NextResponse.json(
              { error: `Error! Something went wrong fetching ${ AWS_PARAMETER_NAMES.JWT_SECRET }: ${ error }`, },
              { status: 400, },
            )
          }

          const token = sign(
            { email, username, password },
            secret,
            { expiresIn: MAX_AGE }
          )

          /**
           * @dev 3. Store the cookie
           */
          cookies().set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NEXT_NODE_ENV ? false : true,
            sameSite: 'strict',
            path: '/',
          })

          const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'

          /**
           * @dev 4. Return response
           */
          return NextResponse.json(
            { message: 'Verified email, username, and password' },
            { 
              status: 200,
              headers: { 'Set-Cookie': cookieValue }
            },
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
