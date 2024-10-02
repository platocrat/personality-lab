// Externals
import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import {
  UpdateCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
// Locals
import {
  SSCrypto,
  MAX_AGE,
  COOKIE_NAME,
  ddbDocClient,
  StudyAsAdmin,
  ACCOUNT_ADMINS,
  fetchAwsParameter,
  ACCOUNT__DYNAMODB,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
  EncryptedCookieFieldType,
  HASHED_PASSWORD__DYNAMODB,
} from '@/utils'



// ---------------------------------- Types ------------------------------------
type EncryptedItem = { 
  iv: string
  encryptedData: string 
}

export type EncryptedItems = { 
  [key: string]: {
    iv: string
    encryptedData: string
  }
}



// ------------------------------- Functions -----------------------------------
export function hasJWT(
  cookies,
  getJWT?: boolean
) {
  /**
   * @dev 1. Check if a cookie exists for the user
   */
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)

  if (!token) {
    const message = 'Unauthorized: No valid JSON web token was found in the request'

    return NextResponse.json(
      { message },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } else {
    if (getJWT) {
      const JWT = token.value
      return JWT
    } else {
      return
    }
  }
}



export function getEncryptedItems(
  toEncrypt: { [key: string]: string }[],
  secretKeyCipher: Buffer
): EncryptedItems {
  let encryptedItems: EncryptedItems = {}

  toEncrypt.forEach((item: { [key: string]: string }, i: number): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const encryptedItem = new SSCrypto().encrypt(
      value,
      secretKeyCipher
    )

    encryptedItems[key] = encryptedItem
  })

  return encryptedItems
}



export function getDecryptedItems(
  toDecrypt: { [key: string]: EncryptedCookieFieldType }[],
  secretKeyCipher: Buffer
): { [key: string]: string } {
  let decryptedItems: { [key: string]: string } = {}

  toDecrypt.forEach((
    item: { [key: string]: EncryptedCookieFieldType }, 
    i: number
  ): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const decryptedItem = new SSCrypto().decrypt(
      value.encryptedData,
      secretKeyCipher,
      value.iv,
    )

    decryptedItems[key] = decryptedItem
  })

  return decryptedItems
}



/**
 * @param cookies Imported from `next/header`
 */
export function setJwtCookieAndGetCookieValue(
  cookies,
  encryptedItems: EncryptedItems,
  passwordHash: string,
  JWT_SECRET: string,
) {
  /**
   * @dev 1. Sign the JWT 
   * @notice Make sure the password that is stored in the cookie is hashed!
   */
  const token = sign(
    {
      ...encryptedItems,
      password: passwordHash,
    },
    JWT_SECRET as string,
    { expiresIn: MAX_AGE.SESSION }
  )

  // 2. Delete previous cookie
  cookies().delete(COOKIE_NAME)

  // 3. Store the cookie
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
     * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
     */
    secure: true,
    sameSite: 'strict',
    path: '/',
  })

  // 4. Get the cookie value from the cookie name
  const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'
  return cookieValue
}



/**
 * @param cookies Imported from `next/header`
 */
export async function verifiedEmailAndPasswordSwitch(
  switchCondition: string,
  cookies,
  email: string,
  // username: string,
  storedParticipant: PARTICIPANT__DYNAMODB | undefined,
  storedStudiesAsAdmin: StudyAsAdmin[] | [],
  storedPassword: HASHED_PASSWORD__DYNAMODB,
): Promise<NextResponse<{ error: string }> | NextResponse<{ message: string }>> {
  switch (switchCondition) {
    // Code for when both email and password are verified
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

          // Determine if the new user is an admin
          const isGlobalAdmin = ACCOUNT_ADMINS.some(
            admin => admin.email === email
          )
          // Determine if the new user is a participant
          const isParticipant = storedParticipant?.id !== undefined
            ? true
            : false

          const timestamp = Date.now().toString()

          const toEncrypt: { [key: string]: string }[] = [
            { email: email as string },
            // { username: username as string },
            { studiesAsAdmin: JSON.stringify(storedStudiesAsAdmin) },
            { isGlobalAdmin: isGlobalAdmin.toString() },
            { isParticipant: isParticipant.toString() },
            { timestamp: timestamp },
          ]

          const encryptedItems = getEncryptedItems(
            toEncrypt,
            secretKeyCipher
          )

          const cookieValue = setJwtCookieAndGetCookieValue(
            cookies,
            encryptedItems,
            storedPassword.hash,
            JWT_SECRET,
          )

          const message = 'Verified email and password'

          /**
           * @dev 5. Perform `Query` operation to find email's account entry in
           *         the `accounts` table. Then, perform an `Update` operation
           *         on the account entry to update its `lastLoginTimestamp`
           *         property.
           */
          const TableName = DYNAMODB_TABLE_NAMES.accounts
          
          let KeyConditionExpression = 'email = :emailValue',
            ExpressionAttributeValues: { [ key: string ]: any } = { 
              ':emailValue': email 
            },
            input: QueryCommandInput | UpdateCommandInput = {
              TableName,
              KeyConditionExpression,
              ExpressionAttributeValues,
            },
            command: QueryCommand | UpdateCommand = new QueryCommand(input)

          // Peform the `Query` operation on the DynamoDB table.
          try {
            const response = await ddbDocClient.send(command)

            const items = (response.Items as any) as ACCOUNT__DYNAMODB[]

            if (items) {        
              /**
               * @dev 6. Perform `Update` operation on the account entry to 
               *         update its `lastLoginTimestamp` property.
               */
              const account = items[0]
              const createdAtTimestamp = account.createdAtTimestamp
              
              const lastLoginTimestamp = Date.now()

              const Key = { email, createdAtTimestamp }
              const UpdateExpression = 'set lastLoginTimestamp = :lastLoginTimestamp'

              ExpressionAttributeValues = { ':lastLoginTimestamp': lastLoginTimestamp }
              input = {
                TableName,
                Key,
                UpdateExpression,
                ExpressionAttributeValues
              }
              command = new UpdateCommand(input)

              try {
                const response = await ddbDocClient.send(command)
                
                /**
                 * @dev 7. Return response with variables necessary for the 
                 *         client and with the new cookie in the `Set-Cookie` 
                 *         response header.
                 */
                return NextResponse.json(
                  {
                    message,
                    isGlobalAdmin,
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
              } catch (error: any) {
                // Something went wrong
                const errorMessage = `Failed 'Update' operation for '${
                  email
                }' on the '${TableName}' table`

                console.error(errorMessage)

                return NextResponse.json(
                  { error: `${errorMessage}: ${error}` },
                  {
                    status: 500,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  },
                )
              }
            // If the `email` is not found after performing the `Query` 
            // operation, log an error message on the server and pass the error
            // message to the client.
            } else {
              const error = `'${
                email
              }' was not found from the Query operation on the '${
                TableName
              }' table`

              console.error(error)

              return NextResponse.json(
                { 
                  error, 
                },
                {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
            }
          // Log the error on the server and pass the error to the client if the
          // the `Query` operation failed.
          } catch (error: any) {
            // Something went wrong
            const errorMessage = `Failed Query operation for '${ 
              email 
            }' on the '${TableName}' table`

            console.error(errorMessage)

            return NextResponse.json(
              { error: `${errorMessage}: ${ error }` },
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
          }
        } else {
          return SECRET_KEY as NextResponse<{ error: string }>
        }
      } else {
        return JWT_SECRET as NextResponse<{ error: string }>
      }

      break

    // Code for when only email is verified
    case 'true-false':
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 200 },
      )
      break

    // Code for when only password is verified
    case 'false-true':
      return NextResponse.json(
        { message: 'Incorrect email' },
        { status: 200 },
      )
      break

    // Code for when neither is verified
    default:
      return NextResponse.json(
        { message: 'Incorrect email and password' },
        { status: 200 },
      )
      break
  }
}