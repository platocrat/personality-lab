// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { 
  PutCommand, 
  QueryCommand, 
  PutCommandInput, 
  QueryCommandInput 
} from '@aws-sdk/lib-dynamodb'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  MAX_AGE, 
  ssmClient,
  COOKIE_NAME,
  ddbDocClient,
  LibsodiumUtils,
  ACCOUNT__DYNAMODB,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES, 
  DYNAMODB_TABLE_NAMES,
} from '@/utils'
import { ACCOUNT_ADMINS } from '@/utils/constants'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { 
      email, 
      username, 
      password // Contains a password that is already hashed
    } = await req.json()

    /**
     * @dev 1. Construct the `QueryCommand` to check if the username exists in
     *         the DynamoDB Table
     */
    const IndexName = 'username-index'
    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression = 'username = :usernameValue'
    const ExpressionAttributeValues = { ':usernameValue': username }


    let input: QueryCommandInput | PutCommandInput | GetParameterCommandInput = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues
    },
      command: QueryCommand | PutCommand | GetParameterCommand = new QueryCommand(input)

    /**
     * @dev 1. Check if the username is already in the DynamoDB table
     */
    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && response.Items.length > 0) {
        // Only return a response if the username exists in the DynamoDB Table
        if ((response.Items[0] as ACCOUNT__DYNAMODB).username) {
          return NextResponse.json(
            { message: 'Username exists' },
            { status: 200 },
          )
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
        { status: 500 },
      )
    }
    
    /**
     * @dev 2. Store the new user's sign-up data
     */
    // Get timestamp after the username is validated.
    const timestamp = new Date().getTime()

    /**
     * @dev 3. Determine if the new user is an admin
     */
    const isAdmin = ACCOUNT_ADMINS.some(admin => admin.email === email)

    input = {
      TableName,
      Item: { 
        email,
        isAdmin,
        username, 
        password, // Contains a password that is already hashed
        timestamp
      },
    }

    command = new PutCommand(input)


    try {
      const response = await ddbDocClient.send(command)

      const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

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
          const encryptedIsAdmin = await LibsodiumUtils.encryptData(
            isAdmin.toString(),
            secretKeyUint8Array
          )
          const encryptedTimestamp = await LibsodiumUtils.encryptData(
            timestamp.toString(),
            secretKeyUint8Array
          )

          /**
           * @dev Make sure the password that is stored in the cookie is hashed!
           */
          const token = sign(
            {
              email: encryptedEmail,
              isAdmin: encryptedIsAdmin,
              username: encryptedUsername,
              password: password.hash,
              timestamp: encryptedTimestamp
            },
            JWT_SECRET as string,
            { expiresIn: MAX_AGE.SESSION }
          )

          /**
           * @dev 5. Store the cookie
          */
          cookies().set(COOKIE_NAME, token, {
            /**
             * @dev A cookie with the `HttpOnly` attribute can't be modified by 
             * JavaScript, for example using `Document.cookie`; it can only be
             * modified when it reaches the server. Cookies that persist user 
             * sessions for example should have the `HttpOnly` attribute set — 
             * it would be really insecure to make them available to JavaScript. 
             * This precaution helps mitigate cross-site scripting (`XSS`) 
             * attacks.
             * 
             * See Mozilla docs for more info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
             */
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
             * See Mozilla docs for more info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
             */
            sameSite: 'strict',
            path: '/',
            // expires: MAX_AGE.SESSION,
          })

          const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'

          return NextResponse.json(
            { 
              message: 'User has successfully signed up',
              isAdmin
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
      } else { // Return the error in the json of the `NextResponse`
        return JWT_SECRET as NextResponse<{ error: string }>
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
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