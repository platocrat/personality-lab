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
import { 
  MAX_AGE,
  ssmClient,
  COOKIE_NAME, 
  ddbDocClient,
  LibsodiumUtils,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
 } from '@/utils'
import { BESSI_accounts } from '../email/route'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()     

    const input: QueryCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_ACCOUNTS,
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

        const condition = `${ verifiedUsername }-${ verifiedPassword }`

        switch (condition) {
          // Code for when both username and password are verified
          case 'true-true':
            const JWT_SECRET = await fetchAwsParameter(
              AWS_PARAMETER_NAMES.JWT_SECRET
            )

            if (typeof JWT_SECRET === 'string') {
              const SECRET_KEY = await fetchAwsParameter(
                AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
              )

              if (typeof SECRET_KEY === 'string') {
                const secretKeyUint8Array = LibsodiumUtils.base64ToUint8Array(
                  SECRET_KEY
                )

                const encryptedEmail = await LibsodiumUtils.encryptData(
                  email,
                  secretKeyUint8Array
                )
                const encryptedUsername = await LibsodiumUtils.encryptData(
                  username,
                  secretKeyUint8Array
                )

                // Get timestamp after the username is validated.
                const timestamp = new Date().getTime().toString()

                const encryptedTimestamp = await LibsodiumUtils.encryptData(
                  timestamp,
                  secretKeyUint8Array
                )

                /**
                 * @dev Make sure the password that is stored in the cookie is hashed!
                 */
                const token = sign(
                  {
                    email: encryptedEmail,
                    username: encryptedUsername,
                    password: hashedPassword,
                    timestamp: encryptedTimestamp
                  },
                  JWT_SECRET as string,
                  { expiresIn: MAX_AGE.SESSION }
                )

                /**
                 * @dev 3. Delete previous cookie
                 */
                cookies().delete(COOKIE_NAME)

                /**
                 * @dev 4. Store the cookie
                 */
                cookies().set(COOKIE_NAME, token, {
                  httpOnly: true,
                  secure: process.env.NEXT_NODE_ENV ? false : true,
                  sameSite: 'strict',
                  path: '/',
                })

                const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'

                const message = 'Verified email, username, and password'

                /**
                 * @dev 5. Return response
                 */
                return NextResponse.json(
                  { message: message },
                  {
                    status: 200,
                    headers: { 'Set-Cookie': cookieValue }
                  },
                )
              } else {
                return SECRET_KEY as NextResponse<{ error: string }>
              }
            } else {
              return JWT_SECRET as NextResponse<{ error: string }>
            }

            break

          // Code for when only username is verified
          case 'true-false':
            return NextResponse.json(
              { message: 'Incorrect password' },
              { status: 200 },
            )
            break

          // Code for when only password is verified
          case 'false-true':
            return NextResponse.json(
              { message: 'Incorrect username' },
              { status: 200 },
            )
            break

          // Code for when neither is verified
          default:
            return NextResponse.json(
              { message: 'Incorrect username and password' },
              { status: 200 },
            )
            break
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
