// Externals
import {
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm'
import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  PutCommandInput,
  UpdateCommandInput,
  NativeAttributeValue,
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  ddbDocClient,
  ACCOUNT_ADMINS,
  fetchAwsParameter,
  getEncryptedItems,
  ACCOUNT__DYNAMODB,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
  setJwtCookieAndGetCookieValue,
} from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const {
      email,
      // username,
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
          const account = response.Items[0] as ACCOUNT__DYNAMODB
          /**
           * @dev 1.1.2 Get the createdAt from the database entry
           */
          const createdAtTimestamp = account.createdAtTimestamp

          /**
           * @dev 1.1.3 Since the email exists, the user is an unregistered 
           *            participant, so we set `isParticipant` to `true`
           */
          const isParticipant = true

          /**
           * @dev 1.1.4 Determine if the new user is an admin.
           */
          const isGlobalAdmin = ACCOUNT_ADMINS.some(
            admin => admin.email === email
          )

          /**
           * @dev 1.1.5 Set the current timestamp that the account entry is 
           *            updated at.
           */
          const updatedAtTimestamp = Date.now()

          /**
           * @dev 1.1.6 Construct `UpdateCommand` arguments
           */
          const Key = {
            email,
            createdAtTimestamp
          }
          // const UpdateExpression =
          //   'set isGlobalAdmin = :isGlobalAdmin, username = :username, password = :password, updatedAtTimestamp = :updatedAtTimestamp'
          const UpdateExpression =
            'set isGlobalAdmin = :isGlobalAdmin, password = :password, updatedAtTimestamp = :updatedAtTimestamp'
          const ExpressionAttributeValues = {
            ':isGlobalAdmin': isGlobalAdmin,
            // ':username': username,
            ':password': password, // Assuming password is already hashed
            ':updatedAtTimestamp': updatedAtTimestamp
          }

          input = {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues
          }

          command = new UpdateCommand(input)

          /**
           * @dev 1.1.7 Attempt to perform `Update` operation on DynamoDB table
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

                const toEncrypt: { [key: string]: string }[] = [
                  { email: email as string },
                  // { username: username as string },
                  { isGlobalAdmin: isGlobalAdmin.toString() },
                  { isParticipant: isParticipant.toString() },
                  { timestamp: updatedAtTimestamp.toString() },
                ]

                const encryptedItems = getEncryptedItems(
                  toEncrypt,
                  secretKeyCipher
                )

                const cookieValue = setJwtCookieAndGetCookieValue(
                  cookies,
                  encryptedItems,
                  password.hash,
                  JWT_SECRET,
                )

                /**
                 * @dev 1.1.7 Return the cookie value and `isGlobalAdmin` in the 
                 *            response
                 */
                return NextResponse.json(
                  {
                    message: 'User has successfully signed up',
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





    // /**
    //  * @dev 2.0 Construct the `QueryCommand` to check if the username exists in
    //  *         the `accounts table
    //  */
    // const IndexName = 'username-index'

    // KeyConditionExpression = 'username = :usernameValue'
    // ExpressionAttributeValues = { ':usernameValue': username }

    // input = {
    //   TableName,
    //   IndexName,
    //   KeyConditionExpression,
    //   ExpressionAttributeValues
    // }





    /**
     * @dev 2.0 Construct the `QueryCommand` to check if the email exists in
     *         the `accounts table
     */
    const IndexName = 'email-index'
    KeyConditionExpression = 'email = :emailValue'
    ExpressionAttributeValues = { ':emailValue': email }

    input = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues
    }

    command = new QueryCommand(input)





    // /**
    //  * @dev 2.1.0 Check if the username, with a password, is already in the 
    //  *         DynamoDB table
    //  */
    // try {
    //   const response = await ddbDocClient.send(command)


    //   if (response.Items && response.Items.length > 0) {
    //     /**
    //      * @dev 2.1.1 Only return a response if the username exists in the 
    //      *          DynamoDB Table.
    //      */
    //     if ((response.Items[0] as ACCOUNT__DYNAMODB).username) {
    //       return NextResponse.json(
    //         { message: 'Username exists' },
    //         { status: 200 },
    //       )
    //     }
    //   }
    // } catch (error: any) {
    //   return NextResponse.json(
    //     { error: error },
    //     { status: 500 },
    //   )
    // }





    /**
     * @dev 2.1.0 Check if the email, with a password, is already in the 
     *         DynamoDB table
     */
    try {
      const response = await ddbDocClient.send(command)


      if (response.Items && response.Items.length > 0) {
        /**
         * @dev 2.1.1 Only return a response if the email exists in the 
         *          DynamoDB Table.
         */
        if ((response.Items[0] as ACCOUNT__DYNAMODB).email) {
          return NextResponse.json(
            { message: 'Email exists' },
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
    // Get timestamp after the email is validated.
    const createdAtTimestamp = Date.now()
    const updatedAtTimestamp = 0

    /**
     * @dev 3.1 Determine if the new user is an admin
     */
    const isGlobalAdmin = ACCOUNT_ADMINS.some(admin => admin.email === email)

    /**
     * @dev 3.2 The new user has no pre-existing account entry in the `accounts`
     *          table, so `isParticipant` is set to `false`.
     */
    const isParticipant = false

    const Item = {
      email,
      // username,
      password, // Contains a password that is already hashed
      isGlobalAdmin,
      createdAtTimestamp,
      updatedAtTimestamp,
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

          const toEncrypt: { [key: string]: string }[] = [
            { email: email as string },
            // { username: username as string },
            { isGlobalAdmin: isGlobalAdmin.toString() },
            { isParticipant: isParticipant.toString() },
            { timestamp: createdAtTimestamp.toString() },
          ]

          const encryptedItems = getEncryptedItems(
            toEncrypt,
            secretKeyCipher
          )

          const cookieValue = setJwtCookieAndGetCookieValue(
            cookies,
            encryptedItems,
            password.hash,
            JWT_SECRET,
          )

          /**
           * @dev 3.3.1 Return the cookie value and `isGlobalAdmin` in the 
           *         response
           */
          return NextResponse.json(
            {
              message: 'User has successfully signed up',
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