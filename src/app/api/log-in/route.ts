// Externals
import { 
  GetParameterCommand,
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  MAX_AGE,
  SSCrypto,
  ssmClient,
  COOKIE_NAME, 
  ddbDocClient,
  ACCOUNT_ADMINS,
  fetchAwsParameter, 
  ACCOUNT__DYNAMODB,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
 } from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { 
      email, 
      username, 
      password, // Password is already hashed
    } = await req.json()     

    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }

    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command = new QueryCommand(input)


    /**
     * @dev 1. Verify username and password
     */
    try {
      const response = await ddbDocClient.send(command)

      if (
        response.Items && 
        (response.Items[0] as ACCOUNT__DYNAMODB).password
      ) {
        const storedUsername = (response.Items[0] as ACCOUNT__DYNAMODB).username
        const storedPassword = (response.Items[0] as ACCOUNT__DYNAMODB).password
        const storedParticipant = (response.Items[0] as ACCOUNT__DYNAMODB).participant

        const verifiedUsername = storedUsername === username
        const verifiedPassword = new SSCrypto().verifyPassword(
          password,
          storedPassword.hash,
          storedPassword.salt,
        )

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
                const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')

                const encryptedEmail = new SSCrypto().encrypt(
                  email, 
                  secretKeyCipher
                )
                const encryptedUsername = new SSCrypto().encrypt(
                  username, 
                  secretKeyCipher
                )
                // Determine if the new user is an admin
                const isAdmin = ACCOUNT_ADMINS.some(admin => admin.email === email)
                const encryptedIsAdmin = new SSCrypto().encrypt(
                  isAdmin.toString(), 
                  secretKeyCipher
                )
                // Determine if the new user is a participant
                const isParticipant = storedParticipant?.id !== undefined ? true : false
                const encryptedIsParticipant = new SSCrypto().encrypt(
                  isParticipant.toString(), 
                  secretKeyCipher
                )
                // Get timestamp.
                const timestamp = Date.now().toString()
                const encryptedTimestamp = new SSCrypto().encrypt(
                  timestamp, 
                  secretKeyCipher
                )

                /**
                 * @dev Make sure the password that is stored in the cookie is hashed!
                 */
                const token = sign(
                  {
                    email: encryptedEmail,
                    username: encryptedUsername,
                    password: storedPassword.hash,
                    isAdmin: encryptedIsAdmin,
                    isParticipant: encryptedIsParticipant,
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
                  /**
                   * @todo Change to `true` to ensure cookie is only sent to 
                   * the server with an encrypted request over the HTTPS 
                   * protocol (except on localhost), which means MITM attackers
                   * can't access it easily. Insecure sites (with `http`: in 
                   * the URL) can't set cookies with the `Secure` attribute. 
                   * However, don't assume that `Secure` prevents all access to
                   * sensitive information in cookies. For example, someone with
                   * access to the client's hard disk (or JavaScript if the 
                   * `HttpOnly` attribute isn't set) can read and modify the
                   * information.
                   * 
                   * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
                   */
                  secure: false,
                  sameSite: 'strict',
                  path: '/',
                })

                const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'

                const message = 'Verified email, username, and password'

                /**
                 * @dev 5. Return response
                 */
                return NextResponse.json(
                  { 
                    message,
                    isAdmin,
                    isParticipant,
                  },
                  {
                    status: 200,
                    headers: { 
                      'Set-Cookie': cookieValue,
                      'Content-Type': 'application/json'
                    }
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
      const errorMessage = `Cannot read properties of undefined (reading 'password')`

      if (error.message === errorMessage) {
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
