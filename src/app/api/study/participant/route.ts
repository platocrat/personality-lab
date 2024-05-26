// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import {
  getEntryId,
  ddbDocClient,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
  STUDY__DYNAMODB,
} from '@/utils'



/**
 * @dev POST: 
 *      1. `Update` an account entry's `participant` attribute in the 
 *         `accounts` table with the new `participant` object.
 *      2. `Update` a study entry's `participants` attribute in the `studies` 
 *         table with the new `participant` object.
 * @param req 
 * @param res
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { participant, studyId } = await req.json()

    /**
     * @dev 1.0 Get the ID for the participant object.
     */
    const participantId = await getEntryId(participant)

    const participant_: PARTICIPANT__DYNAMODB = {
      id: participantId,
      email: participant.email,
      username: participant.username,
      studies: participant.studies,
      adminEmail: participant.adminEmail,
      adminUsername: participant.adminUsername,
      isNobelLaureate: participant.isNobelLaureate,
      timestamp: Date.now(),
    }

    /**
     * @dev 1.1 Construct `QueryCommand` to fetch the participant's account 
     *          entry from the `accounts` table.
     */
    let TableName = DYNAMODB_TABLE_NAMES.accounts,
      KeyConditionExpression: string = 'email = :emailValue',
      ExpressionAttributeValues: { [key: string]: any } = { 
        ':emailValue': participant.email,
      },
      input: QueryCommandInput | UpdateCommandInput = {
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      },
      command: QueryCommand | UpdateCommand = new QueryCommand(input)

    /**
     * @dev 1.2 Attempt to perform the `QueryCommand` on DynamoDB to update 
     *          the user's account entry or create a NEW entry in the `accounts`
     *          table
     */
    try {
      const response = await ddbDocClient.send(command)

      // 1.2.1 Check if the user's email exists in the `accounts` table
      if (
        response.Items &&
        (response.Items[0] as ACCOUNT__DYNAMODB).email
      ) {
        /**
         * @dev 1.2.1.1 Get the `timestamp` from the user's account entry. The 
         *      `timestamp` is used to construct the `UpdateCommand` to update
         *      the user's account entry.
         */
        const storedTimestamp = (response.Items[0] as ACCOUNT__DYNAMODB).timestamp
        // We also need `account.studies` to merge with the study of the new
        // `participant` entry
        const storedStudies = (response.Items[0] as ACCOUNT__DYNAMODB).studies

        const updatedStudies: {
          name: string
          assessmentId: string
        }[] = storedStudies
          ? [ ...storedStudies, participant.studies[0] ]
          : [ participant.studies[0] ]


        const participantWithUpdatedStudies: PARTICIPANT__DYNAMODB = {
          ...participant_,
          studies: updatedStudies,
          timestamp: Date.now(),
        }

        // 1.2.1.2 Construct the `UpdateCommand` to send to DynamoDB to update
        //         the `participant` attribute of the account entry in the
        //         `accounts` table.
        const Key = {
          email: participant.email,
          timestamp: storedTimestamp
        }
        const UpdateExpression = 'set participant = :participant'
        
        ExpressionAttributeValues = { 
          ':participant': participantWithUpdatedStudies
        }

        input = {
          TableName,
          Key,
          UpdateExpression,
          ExpressionAttributeValues
        }
        
        command = new UpdateCommand(input)


        const successMessage = `Account entry for ${
          participant.email
        } has been updated in the ${TableName} table`


        // 1.2.1.3 Attempt to perform the `UpdateCommand` on DynamoDB to update
        //         the `participant` attribute of the account entry in the
        //         `accounts` table.
        try {
          const response = await ddbDocClient.send(command)


          /**
           * @dev 2.0 Construct the `QueryCommand` to get the `ownerEmail` that we 
           *     will use as the partition, or primary, key to perform the 
           *     `UpdateCommand` to update the study entry's `participant`
           *      attribute in the `studies` table.
           */
          TableName = DYNAMODB_TABLE_NAMES.studies

          const IndexName = 'id-index'

          KeyConditionExpression = 'id = :idValue'
          ExpressionAttributeValues = { ':idValue': studyId }

          input = {
            TableName,
            IndexName,
            KeyConditionExpression,
            ExpressionAttributeValues,
          } as QueryCommandInput

          command = new QueryCommand(input)


          // 2.1 Attempt to perform Query operation to get `ownerEmail`
          try {
            const response = await ddbDocClient.send(command)


            // 2.1.1 If `ownerEmail` exists...
            if (response.Items && response.Items.length > 0) {
              const timestamp = (response.Items as STUDY__DYNAMODB[])[0].timestamp
              const ownerEmail = (response.Items as STUDY__DYNAMODB[])[0].ownerEmail
              const previousParticipants = (response.Items as STUDY__DYNAMODB[])[0].participants

              // Update list of participants using existing participants.
              const updatedParticipants = previousParticipants 
                ? [ ...previousParticipants, participant_ ] 
                : [ participant_ ]

              // 2.1.1.1 Construct the `UpdateCommand` to update the `participant`
              //         property of the study entry in the `studies` table. 
              const Key = { 
                ownerEmail,
                timestamp
              }
              const UpdateExpression = 'set participants = :participants'

              ExpressionAttributeValues = { 
                ':participants': updatedParticipants
              }

              input = {
                TableName,
                Key,
                UpdateExpression,
                ExpressionAttributeValues
              }

              command = new UpdateCommand(input)


              const successMessage = `'participants' property for study ID ${studyId
                } has been updated in the ${TableName} table`


              /**
               * @dev 2.1.1.2 Attempt to perform the `UpdateCommand` on 
               *              DynamoDB to update the `participant` property on 
               *              the study entry for this ID in the `studies` table
               */
              try {
                const response = await ddbDocClient.send(command)

                // console.log(`response: `, response)


                const message = successMessage || 'Operation successful'

                // Return `participantId`
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
                console.log(
                  `Error performing Update operation on the '${TableName
                  }' table to update the 'participants' property: `,
                  error
                )

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
            } else {
              return NextResponse.json(
                { message: 'Owner email does not exist' },
                {
                  status: 404,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                },
              )
            }
          } catch (error: any) {
            console.log(
              `Error using ID '${studyId}' to perform Query operation on '${TableName
              }' to get ownerEmail: `,
              error
            )


            // Error sending POST request to DynamoDB table
            return NextResponse.json(
              { error: error },
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json'
                }
              },
            )
          }
        } catch (error: any) {
          console.log(
            `Error performing Update operation on EXISTING account entry in the '${
              TableName
            }' to update the 'participant' property: `, 
            error
          )

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
      

    /**
     * @dev 1.2.2.0 If the user's email does not exist in the `accounts` table, 
     *              use the current timestamp to create a completely NEW entry
     */
    } catch (error: any) {
      // 1.2.2.1 Construct the `UpdateCommand` using the current timestamp to
      //         send to DynamoDB
      const Key = {
        email: participant.email,
        timestamp: participant.timestamp // Current timestamp
      }
      const UpdateExpression = 'set participant = :participant'
      
      ExpressionAttributeValues = { ':participant': participant_ }

      input = {
        TableName,
        Key,
        UpdateExpression,
        ExpressionAttributeValues
      }

      command = new UpdateCommand(input)


      const successMessage = `Account entry for ${
        participant.email
      } has been updated in the ${TableName} table`


      // 1.2.2.2 Attempt to perform the `UpdateCommand` on DynamoDB
      try {
        const response = await ddbDocClient.send(command)


        /**
         * @dev 2.0 Update the `participants` property of the study entry in the 
         *          `studies` table.
         */
        TableName = DYNAMODB_TABLE_NAMES.studies

        // 2.1 Construct `QueryCommand` to get the `ownerEmail` that we will use as
        //     the partition/primary key to then perform the `UpdateCommand` to
        //     update the same study entry's `participant` property.
        const IndexName = 'id-index'

        TableName = DYNAMODB_TABLE_NAMES.studies
        KeyConditionExpression = 'id = :idValue'
        ExpressionAttributeValues = { ':idValue': studyId }

        input = {
          TableName,
          IndexName,
          KeyConditionExpression,
          ExpressionAttributeValues,
        }

        command = new QueryCommand(input)


        // 2.2 Attempt to perform Query operation to get `ownerEmail` 
        //     partition key and `timestamp` sort key: both are required for
        //     `UpdateCommand`
        try {
          const response = await ddbDocClient.send(command)


          // 2.2.1 If `ownerEmail` exists...
          if (response.Items && response.Items.length > 0) {
            const timestamp = (response.Items as STUDY__DYNAMODB[])[0].timestamp
            const ownerEmail = (response.Items as STUDY__DYNAMODB[])[0].ownerEmail
            const previousParticipants = (response.Items as STUDY__DYNAMODB[])[0].participants

            // Update list of participants using existing participants.
            const updatedParticipants: PARTICIPANT__DYNAMODB[] = previousParticipants
              ? [ ...previousParticipants, participant_ ]
              : [ participant_ ]


            // 2.2.1.1 Construct the `UpdateCommand` to update the `participant`
            //         property of the study entry in the `studies` table. 
            const Key = { ownerEmail, timestamp }
            const UpdateExpression = 'set participants = :participants'

            ExpressionAttributeValues = { ':participants': updatedParticipants }

            input = {
              TableName,
              Key,
              UpdateExpression,
              ExpressionAttributeValues
            }

            command = new UpdateCommand(input)


            const successMessage = `'participants' property for study ID ${studyId
              } has been updated in the ${TableName} table`


            /**
             * @dev 2.2.1.2 Attempt to perform the `UpdateCommand` on DynamoDB to 
             *              update the `participant` property on the study entry 
             *              for this ID in the `studies` table
             */
            try {
              const response = await ddbDocClient.send(command)

              // console.log(`response: `, response)


              const message = successMessage || 'Operation successful'

              // Return `participantId`
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
              console.log(
                `Error performing Update operation on the '${TableName
                }' table to update the 'participants' property: `,
                error
              )

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
          } else {
            return NextResponse.json(
              { message: 'Owner email does not exist' },
              {
                status: 404,
                headers: {
                  'Content-Type': 'application/json'
                }
              },
            )
          }
        } catch (error: any) {
          console.log(
            `Error using ID '${ studyId }' to perform Query operation on '${
              TableName
            }' to get ownerEmail: `, 
            error
          )


          // Error sending POST request to DynamoDB table
          return NextResponse.json(
            { error: error },
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        }




      } catch (error: any) {
        console.log(
          `Error performing Update operation on the NEW account entry '${
            TableName
          }' to update the 'participant' property: `, 
          error
        )

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