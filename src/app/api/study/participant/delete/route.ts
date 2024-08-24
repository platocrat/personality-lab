// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  ddbDocClient,
  STUDY__DYNAMODB,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'



/**
 * @dev DELETE a participant by their ID by updating `study.participants` from
 *      the `studies` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export const DELETE = withApiAuthRequired(async function deleteParticipant(
  req: NextRequest
) {
  if (req.method === 'DELETE') {
    const res = new NextResponse()

    // Auth0
    const session = await getSession(req, res)
    const user = session?.user

    if (!user) {
      const message = `Unauthorized: Auth0 found no 'user' for their session.`
      return NextResponse.json(
        { message },
        {
          status: 401,
        }
      )
    }

    const {
      studyId,
      ownerEmail,
      participantId, // Used to filter existing array of participants
      participantEmail, // Used to query the `accounts` table
      createdAtTimestamp,
    } = await req.json()


    // 1.1 Construct `QueryCommand` to get the `ownerEmail` that we will use as
    //     the partition/primary key to then perform the `UpdateCommand` to
    //     update the same study entry's `participants` property.
    const IndexName = 'id-index'
    
    let TableName = DYNAMODB_TABLE_NAMES.studies,
      KeyConditionExpression = 'id = :idValue',
      ExpressionAttributeValues: { [ key: string ]: any } = { 
        ':idValue': studyId 
      },
      input: QueryCommandInput | UpdateCommandInput = {
        TableName,
        IndexName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      },
      command: QueryCommand | UpdateCommand = new QueryCommand(input)

    // 1.2 Attempt to perform Query operation to get the array of existing
    //     participants.
    try {
      const response = await ddbDocClient.send(command)

      // 1.2.1 If `ownerEmail` exists...
      if (response.Items && response.Items.length > 0) {
        const study = (response.Items as STUDY__DYNAMODB[])[0]

        const ownerEmail = study.ownerEmail
        const createdAtTimestamp = study.createdAtTimestamp
        const previousParticipants = study.participants

        // Update list of participants using existing participants.
        const updatedParticipants = previousParticipants?.filter(
          participant => participant.id !== participantId
        ) as PARTICIPANT__DYNAMODB[] | undefined

        // 1.2.1.1 Construct the `UpdateCommand` to update the `participant`
        //         property of the study entry in the `studies` table. 
        const Key = {
          ownerEmail,
          createdAtTimestamp,
        }
        const UpdateExpression = 'set participants = :participants'

        ExpressionAttributeValues = { ':participants': updatedParticipants }

        input = {
          TableName,
          Key,
          UpdateExpression,
          ExpressionAttributeValues
        }

        command = new UpdateCommand(input)

        /**
         * @dev 1.2.1.2 Attempt to perform the `Update` operation to update 
         *              array of participants of the `studyId` in the `studies`
         *              table.
         */
        try {
          const response = await ddbDocClient.send(command)

          // console.log(`response: `, response)

          /**
           * @dev 1.1 Construct `QueryCommand` to fetch the participant's account 
           *          entry from the `accounts` table.
           */
          TableName = DYNAMODB_TABLE_NAMES.accounts
          KeyConditionExpression = 'email = :emailValue'
          ExpressionAttributeValues = {
            ':emailValue': participantEmail,
          }
          input = {
            TableName,
            KeyConditionExpression,
            ExpressionAttributeValues,
          }
          command = new QueryCommand(input)

          /**
           * @dev 1.2 Attempt to perform the `QueryCommand` on DynamoDB to get
           *          the specific `account` object
           */
          try {
            const response = await ddbDocClient.send(command)


            // 1.2.1 Check if the user's email exists in the `accounts` table
            if (
              response.Items &&
              (response.Items[0] as ACCOUNT__DYNAMODB).email
            ) {
              const account = response.Items[0] as ACCOUNT__DYNAMODB
              const participant = account.participant as PARTICIPANT__DYNAMODB
              
              /**
               * @dev Update `account.participant.studies` property to ensure
               *      that the account is able to re-register for the study that
               *      they had been deleted from.
               */
              const updatedAccountStudies = account.participant?.studies.filter(
                (study: STUDY_SIMPLE__DYNAMODB): boolean => study.id !== studyId
              ) as STUDY_SIMPLE__DYNAMODB[]

              /**
               * @dev 1.2.1.3 Get the `timestamp` from the user's account entry. 
               *      The `timestamp` and the `studies` that are already under 
               *      this account entry are used to construct the 
               *      `UpdateCommand` to update the user's account entry's:
               *          1) `participant`, and 
               *          2) `participant.studies`
               *      attributes.
               */
              const storedCreatedAtTimestamp = account.createdAtTimestamp

              const participantWithUpdatedStudies: PARTICIPANT__DYNAMODB = {
                id: participant.id,
                email: participant.email,
                studies: updatedAccountStudies,
                timestamp: Date.now(),
              }

              // 1.2.1.4 Construct the `UpdateCommand` to send to DynamoDB to update
              //         the `participant` attribute of the account entry in the
              //         `accounts` table.
              const Key = {
                email: participantEmail,
                createdAtTimestamp: storedCreatedAtTimestamp
              }
              const UpdateExpression =
                'set participant = :participant, updatedAtTimestamp = :updatedAtTimestamp'

              ExpressionAttributeValues = {
                ':participant': participantWithUpdatedStudies,
                ':updatedAtTimestamp': Date.now(),
              }

              input = {
                TableName,
                Key,
                UpdateExpression,
                ExpressionAttributeValues,
              }

              command = new UpdateCommand(input)

              const message = `Account entry for ${participantEmail
                } has been updated in the ${
                  TableName
                } table to remove study with study ID '${
                  studyId
                }`


              // 1.2.1.5  Attempt to perform the `UpdateCommand` on DynamoDB to 
              //          update the `participant.studies` attribute of the 
              //          account entry in the `accounts` table.
              try {
                const response = await ddbDocClient.send(command)

                console.log(
                  `response from Update operation to update 'account.participant.studies': `, 
                  response
                )

                // Success
                return NextResponse.json(
                  {
                    message,
                  },
                  {
                    status: 200,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
              } catch (error: any) {
                console.error(
                  `Error performing Update operation on the '${TableName
                  }' table to remove a study with study ID '${studyId
                  }' from 'account.participant.studies': `,
                  error
                )

                // Something went wrong
                return NextResponse.json(
                  { error },
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
                { message: 'Account email does not exist' },
                {
                  status: 404,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                },
              )
            }
          } catch (error: any) {
            console.error(
              `Error performing Query operation on the '${
                TableName
              }' table to remove a study with study ID '${
                studyId
              }' from an account's participant property: `,
              error
            )

            // Something went wrong
            return NextResponse.json(
              { error },
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
        } catch (error: any) {
          console.error(
            `Error performing Update operation on the '${
              TableName
            }' table to remove a participant from study with study ID '${
              studyId 
            }': `,
            error
          )

          // Something went wrong
          return NextResponse.json(
            { error },
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      // 1.2.2 Return error message that the Query operation to get the 
      //       existing participants has failed.
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
      console.error(
        `Could not delete participant from study ID '${studyId}' from the '${TableName}' table: `,
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
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
})