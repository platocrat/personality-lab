// Externals
import { 
  UpdateCommand, 
  QueryCommand, 
  QueryCommandInput,
  UpdateCommandInput, 
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  COOKIE_NAME, 
  ddbDocClient, 
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    cookies().delete(COOKIE_NAME)

    /**
     * @dev Perform `Query` operation to find email's account entry in
     *      the `accounts` table. Then, perform an `Update` operation
     *      on the account entry to update its `lastLogoutTimestamp`
     *      property.
     */
    const TableName = DYNAMODB_TABLE_NAMES.accounts

    let KeyConditionExpression = 'email = :emailValue',
      ExpressionAttributeValues: { [key: string]: any } = {
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
         * @dev Perform `Update` operation on the account entry to 
         *         update its `lastLogoutTimestamp` property.
         */
        const account = items[0]
        const createdAtTimestamp = account.createdAtTimestamp

        const lastLogoutTimestamp = Date.now()

        const Key = { email, createdAtTimestamp }
        const UpdateExpression = 'set lastLogoutTimestamp = :lastLogoutTimestamp'

        ExpressionAttributeValues = { ':lastLogoutTimestamp': lastLogoutTimestamp }

        try {
          const response = await ddbDocClient.send(command)

          /**
           * @dev Return response
           */
          return NextResponse.json(
            { message: 'User logged out', },
            { 
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
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
        }' was not found from the Query operation on the '${TableName}' table`

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
        { error: `${errorMessage}: ${error}` },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }
  } else {
    return NextResponse.json(
      { 
        error: 'Method Not Allowed',
      },
      { 
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}