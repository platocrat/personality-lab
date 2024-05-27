// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { 
  PutCommand, 
  QueryCommand, 
  UpdateCommand,
  PutCommandInput, 
  QueryCommandInput,
  UpdateCommandInput,
  NativeAttributeValue, 
} from '@aws-sdk/lib-dynamodb'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  MAX_AGE, 
  SSCrypto,
  ssmClient,
  CookieType,
  COOKIE_NAME,
  ddbDocClient,
  ACCOUNT_ADMINS,
  CookieInputType,
  ACCOUNT__DYNAMODB,
  fetchAwsParameter, 
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
      password // Contains a password that is already hashed
    } = await req.json()
    
    const TableName = DYNAMODB_TABLE_NAMES.accounts

    /**
     * @dev 1.0 Construct `QueryCommand` to check if the user's email already 
     *          exists in the `accounts` table
     */
    let KeyConditionExpression = 'email = :emailValue',
      ExpressionAttributeValues: Record<string, NativeAttributeValue> = { 
        ':emailValue': email
      }

    let input: QueryCommandInput | PutCommandInput
      | GetParameterCommandInput | UpdateCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    },
      command: QueryCommand | PutCommand
        | GetParameterCommand | UpdateCommand = new QueryCommand(input)

    /**
     * @dev 1.1.0 Perform `Query` on `accounts` table to check if the email exists
     */
    try {
      const response = await ddbDocClient.send(command)


      if (response.Items && response.Items.length > 0) {
        if (
          /**
           * @dev 1.1.1 If the email exists, the user is an unregistered 
           *            participant, so perform an `Update` operation on the
           *            unregistered user's account entry in the `accounts` 
           *            table, updating the entry with the password that is 
           *            provided.
           */
          (response.Items[0] as ACCOUNT__DYNAMODB).email &&
          !(response.Items[0] as ACCOUNT__DYNAMODB).password
        ) {
          /**
           * @dev 1.1.2 Get the timestamp from the database entry
           */
          const timestamp = (response.Items[0] as ACCOUNT__DYNAMODB).timestamp

          /**
           * @dev 1.1.3 Since the email exists, the user is an unregistered 
           *            participant, so we set `isParticipant` to `true`
           */
          const isParticipant = true

          /**
           * @dev 1.1.4 Determine if the new user is an admin.
           */
          const isAdmin = ACCOUNT_ADMINS.some(admin => admin.email === email)

          /**
           * @dev 1.1.5 Construct `UpdateCommand` arguments
           */
          const Key = {
            email: email,
            // Timestamp that the participant attribute was added
            timestamp: timestamp
          }
          const UpdateExpression =
            'set isAdmin = :isAdmin, username = :username, password = :password'
          const ExpressionAttributeValues = {
            ':isAdmin': isAdmin,
            ':username': username,
            ':password': password // Assuming password is already hashed
          }

          input = {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues
          }

          command = new UpdateCommand(input)

          /**
           * @dev 1.1.6 Attempt to perform `Update` operation on DynamoDB table
           */
          try {
            const response = await ddbDocClient.send(command)

            const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

            if (typeof JWT_SECRET === 'string') {
              const SECRET_KEY = await fetchAwsParameter(
                AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
              )

              if (typeof SECRET_KEY === 'string') {
                const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')


                const encryptedEmail = new SSCrypto().encrypt(
                  email,
                  secretKeyCipher,
                )
                const encryptedUsername = new SSCrypto().encrypt(
                  username,
                  secretKeyCipher
                )
                const encryptedIsAdmin = new SSCrypto().encrypt(
                  isAdmin.toString(),
                  secretKeyCipher
                )
                const encryptedIsParticipant = new SSCrypto().encrypt(
                  isParticipant.toString(),
                  secretKeyCipher
                )
                const encryptedTimestamp = new SSCrypto().encrypt(
                  timestamp.toString(),
                  secretKeyCipher
                )

                /**
                 * @dev 1.1.7 Make sure the password that is stored in the 
                 *            cookie is hashed!
                 */
                const token = sign(
                  {
                    email,
                    username,
                    password: password.hash, // Hashed password
                    isAdmin,
                    isParticipant,
                    timestamp,
                  },
                  JWT_SECRET as string,
                  { expiresIn: MAX_AGE.SESSION }
                )

                /**
                 * @dev 1.1.8 Store the cookie
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

                /**
                 * @dev 1.1.9 Return the cookie value and `isAdmin` in the 
                 *            response
                 */
                return NextResponse.json(
                  {
                    message: 'User has successfully signed up',
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
              // Return the error in the json of the `NextResponse`
              return JWT_SECRET as NextResponse<{ error: string }>
            }
          } catch (error: any) {
            return NextResponse.json(
              { error: error },
              { status: 500 },
            )
          }
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
        { status: 500 },
      )
    }


    /**
     * @dev 2.0 Construct the `QueryCommand` to check if the username exists in
     *         the `accounts table
     */
    const IndexName = 'username-index'

    KeyConditionExpression = 'username = :usernameValue'
    ExpressionAttributeValues = { ':usernameValue': username }

    input = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues
    }
    
    command = new QueryCommand(input)

    /**
     * @dev 2.1.0 Check if the username, with a password, is already in the 
     *         DynamoDB table
     */
    try {
      const response = await ddbDocClient.send(command)


      if (response.Items && response.Items.length > 0) {
        /**
         * @dev 2.1.1 Only return a response if the username exists in the 
         *          DynamoDB Table.
         */
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
     * @dev 3.0 Store the new user's sign-up data
     */
    // Get timestamp after the username is validated.
    const timestamp = Date.now()

    /**
     * @dev 3.1 Determine if the new user is an admin
     */
    const isAdmin = ACCOUNT_ADMINS.some(admin => admin.email === email)

    /**
     * @dev 3.2 The new user has no pre-existing account entry in the `accounts`
     *          table, so `isParticipant` is set to `false`.
     */
    const isParticipant = false

    const Item = {
      email,
      username,
      password, // Contains a password that is already hashed
      isAdmin,
      timestamp,
    }

    input = {
      TableName,
      Item,
    }

    command = new PutCommand(input)

    /**
     * @dev 3.3.0 Attempt to perform `Put` operation on DynamoDB table
     */
    try {
      const response = await ddbDocClient.send(command)

      const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

      if (typeof JWT_SECRET === 'string') {
        const SECRET_KEY = await fetchAwsParameter(
          AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        )

        if (typeof SECRET_KEY === 'string') {
          const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')


          const encryptedEmail = new SSCrypto().encrypt(
            email,
            secretKeyCipher,
          )
          const encryptedUsername = new SSCrypto().encrypt(
            username,
            secretKeyCipher
          )
          const encryptedIsAdmin = new SSCrypto().encrypt(
            isAdmin.toString(),
            secretKeyCipher
          )
          const encryptedIsParticipant = new SSCrypto().encrypt(
            isParticipant.toString(),
            secretKeyCipher
          )
          const encryptedTimestamp = new SSCrypto().encrypt(
            timestamp.toString(),
            secretKeyCipher
          )


          /**
           * @dev 3.3.1 Make sure the password that is stored in the cookie is 
           *          hashed!
           */
          const token = sign(
            {
              email,
              username,
              password: password.hash, // Hashed password
              isAdmin,
              isParticipant,
              timestamp,
            },
            JWT_SECRET as string,
            { expiresIn: MAX_AGE.SESSION }
          )

          /**
           * @dev 3.3.2 Store the cookie
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

          /**
           * @dev 3.3.3 Return the cookie value and `isAdmin` in the 
           *         response
           */
          return NextResponse.json(
            { 
              message: 'User has successfully signed up',
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
        // Return the error in the json of the `NextResponse`
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