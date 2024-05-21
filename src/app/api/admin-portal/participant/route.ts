// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import {
  getEntryId,
  ddbDocClient,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT_DYNAMODB,
} from '@/utils'



/**
 * @dev POST: Update an `account` entry with the `participant` object as an 
 *      additional property.
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { participant } = await req.json()

    /**
     * @dev 0. Get the ID for the participant object.
     */
    const participantId = await getEntryId(participant)

    const participant_: PARTICIPANT_DYNAMODB = {
      id: participantId,
      name: participant.name,
      email: participant.email,
      adminEmail: participant.adminEmail,
      adminUsername: participant.adminUsername,
      assessmentNames: participant.assessmentNames,
      isNobelLaureate: participant.isNobelLaureate,
      timestamp: participant.timestamp,
    }

    /**
     * @dev 1. Construct `QueryCommand` to fetch the user's account entry from 
     *         the `accounts` table.
     */
    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': participant.email }

    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    let command: QueryCommand | UpdateCommand = new QueryCommand(input)

    /**
     * @dev 2. Attempt to perform the `QueryCommand` on DynamoDB
     */
    try {
      const response = await ddbDocClient.send(command)


      if (
        response.Items &&
        (response.Items[0] as ACCOUNT__DYNAMODB).email
      ) {
        /**
         * @dev 3. Get the `timestamp` from the user's account entry. The 
         *      `timestamp` is used to construct the `UpdateCommand` to update
         *      the user's account entry.
         */
        const storedTimestamp = (response.Items[0] as ACCOUNT__DYNAMODB).timestamp

        /**
         * @dev 4. Construct the `UpdateCommand` to send to DynamoDB
         */
        const Key = {
          email: participant.email,
          timestamp: storedTimestamp
        }
        const UpdateExpression = 'set participant = :participant'
        const ExpressionAttributeValues = { ':participant': participant_ }

        const input: UpdateCommandInput = {
          TableName,
          Key,
          UpdateExpression,
          ExpressionAttributeValues
        }

        const command = new UpdateCommand(input)

        const successMessage = `Account for ${participant.email
          } has been update in the ${DYNAMODB_TABLE_NAMES.accounts
          } table`


        /**
         * @dev 5. Attempt to perform the `UpdateCommand` on DynamoDB
         */
        try {
          const response = await ddbDocClient.send(command)

          const message = successMessage || 'Operation successful'

          /**
           * @dev 6. Return `participantId`
           */
          return NextResponse.json(
            {
              message: message,
              data: participantId,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error: any) {
          console.log(`Error: `, error)

          // Something went wrong
          return NextResponse.json(
            { error: error },
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      }
    } catch (error: any) {
      /**
       * @dev 7. Construct the `UpdateCommand` using the current timtesamp to
       *         send to DynamoDB
       */
      const Key = {
        email: participant.email,
        timestamp: participant.timestamp // Current timestamp
      }
      const UpdateExpression = 'set participant = :participant'
      const ExpressionAttributeValues = { ':participant': participant_ }

      const input: UpdateCommandInput = {
        TableName,
        Key,
        UpdateExpression,
        ExpressionAttributeValues
      }

      const command = new UpdateCommand(input)

      const successMessage = `Account for ${participant.email
        } has been update in the ${DYNAMODB_TABLE_NAMES.accounts
        } table`


      /**
       * @dev 5. Attempt to perform the `UpdateCommand` on DynamoDB
       */
      try {
        const response = await ddbDocClient.send(command)

        const message = successMessage || 'Operation successful'

        /**
         * @dev 6. Return `participantId`
         */
        return NextResponse.json(
          {
            message: message,
            data: participantId,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } catch (error: any) {
        console.log(`Error: `, error)

        // Something went wrong
        return NextResponse.json(
          { error: error },
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}