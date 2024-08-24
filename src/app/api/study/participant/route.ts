// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'



// /**
//  * @dev POST: 
//  *      1. `Update` an account entry's `participant` attribute in the 
//  *         `accounts` table with the new `participant` object.
//  *      2. `Update` a study entry's `participants` attribute in the `studies` 
//  *         table with the new `participant` object.
//  * @param req 
//  * @param res
//  * @returns 
//  */
// export async function POST(
//   req: NextRequest
// ): Promise<any> {
//   if (req.method === 'POST') {
//     const { participant, studyId } = await req.json()

//     /**
//      * @dev 1.0 Get the ID for the participant object.
//      */
//     const participantId = await getEntryId(participant)

//     const participant_: PARTICIPANT__DYNAMODB = {
//       id: participantId,
//       email: participant.email,
//       studies: participant.studies,
//       timestamp: Date.now(),
//     }

//     /**
//      * @dev 1.1 Construct `QueryCommand` to fetch the participant's account 
//      *          entry from the `accounts` table.
//      */
//     let TableName = DYNAMODB_TABLE_NAMES.accounts,
//       KeyConditionExpression: string = 'email = :emailValue',
//       ExpressionAttributeValues: { [key: string]: any } = { 
//         ':emailValue': participant.email,
//       },
//       input: QueryCommandInput | UpdateCommandInput = {
//         TableName,
//         KeyConditionExpression,
//         ExpressionAttributeValues,
//       },
//       command: QueryCommand | UpdateCommand = new QueryCommand(input)

//     /**
//      * @dev 1.2 Attempt to perform the `QueryCommand` on DynamoDB to update 
//      *          the user's account entry or create a NEW entry in the `accounts`
//      *          table
//      */
//     try {
//       const response = await ddbDocClient.send(command)


//       // 1.2.1 Check if the user's email exists in the `accounts` table
//       if (
//         response.Items &&
//         (response.Items[0] as ACCOUNT__DYNAMODB).email
//       ) {
//         const account = response.Items[0] as ACCOUNT__DYNAMODB


//         /**
//          * @dev 1.2.1.1 Check if the account had already registered for this 
//          *              study
//          */
//         const studyToRegisterFor: string = participant_.studies[0].id
//         const studiesForAccount = account.participant?.studies.map(
//           (study: STUDY_SIMPLE__DYNAMODB, i: number): string => study.id
//         ) as string[] | undefined
        
//         const isDuplicateRegistration = studiesForAccount?.includes(
//           studyToRegisterFor
//         ) as boolean

//         /**
//          * @dev 1.2.1.2 If this is a duplicate registration...
//          */
//         if (isDuplicateRegistration) {
//           // Return a 400 status and a message to display on the
//           // form below the register button.
//           const message = `You have already registered for this study!`

//           return NextResponse.json(
//             { message },
//             {
//               status: 400,
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             },
//           )
//         } else {
//           /**
//            * @dev 1.2.1.3 Get the `timestamp` from the user's account entry. The 
//            *      `timestamp` and the `studies` that are already under this 
//            *      account entry are used to construct the `UpdateCommand` to 
//            *      update the user's account entry's:
//            *          1) `participant`, and 
//            *          2) `participant.studies`
//            *      attributes.
//            */
//           const storedCreatedAtTimestamp = account.createdAtTimestamp
//           // We also need `account.participant.studies` to merge with the study 
//           // of the new `participant` entry
//           const storedParticipantStudies = account.participant?.studies

//           const updatedParticipant: STUDY_SIMPLE__DYNAMODB[] = storedParticipantStudies
//             ? [...storedParticipantStudies, participant_.studies[0] ]
//             : [ participant_.studies[0] ]


//           const participantWithUpdatedStudies: PARTICIPANT__DYNAMODB = {
//             ...participant_,
//             studies: updatedParticipant,
//             timestamp: Date.now(),
//           }

//           // 1.2.1.4 Construct the `UpdateCommand` to send to DynamoDB to update
//           //         the `participant` attribute of the account entry in the
//           //         `accounts` table.
//           const Key = {
//             email: participant.email,
//             createdAtTimestamp: storedCreatedAtTimestamp
//           }
//           const UpdateExpression = 
//             'set participant = :participant, updatedAtTimestamp = :updatedAtTimestamp'

//           ExpressionAttributeValues = {
//             ':participant': participantWithUpdatedStudies,
//             ':updatedAtTimestamp': Date.now(),
//           }

//           input = {
//             TableName,
//             Key,
//             UpdateExpression,
//             ExpressionAttributeValues,
//           }

//           command = new UpdateCommand(input)


//           const successMessage = `Account entry for ${participant.email
//             } has been updated in the ${TableName} table`


//           // 1.2.1.5  Attempt to perform the `UpdateCommand` on DynamoDB to 
//           //          update the `participant` attribute of the account entry 
//           //          in the `accounts` table.
//           try {
//             const response = await ddbDocClient.send(command)


//             /**
//              * @dev 1.2.1.5.1 Construct the `QueryCommand` to get the 
//              *                `ownerEmail` that we will use as the partition, 
//              *                or primary, key to perform the `UpdateCommand` to
//              *                update the study entry's `participant` attribute
//              *                in the `studies` table.
//              */
//             TableName = DYNAMODB_TABLE_NAMES.studies

//             const IndexName = 'id-index'

//             KeyConditionExpression = 'id = :idValue'
//             ExpressionAttributeValues = { ':idValue': studyId }

//             input = {
//               TableName,
//               IndexName,
//               KeyConditionExpression,
//               ExpressionAttributeValues,
//             } as QueryCommandInput

//             command = new QueryCommand(input)


//             /**
//              * @dev 1.2.1.5.2  Attempt to perform Query operation to get 
//              *                 `ownerEmail`
//              */
//             try {
//               const response = await ddbDocClient.send(command)


//               // 1.2.1.5.2.1  If `ownerEmail` exists...
//               if (response.Items && response.Items.length > 0) {
//                 const study = (response.Items as STUDY__DYNAMODB[])[0]

//                 const ownerEmail = study.ownerEmail
//                 const createdAtTimestamp = study.createdAtTimestamp
//                 const previousParticipants = study.participants

//                 // Update list of participants using existing participants.
//                 const updatedParticipants = previousParticipants
//                   ? [ ...previousParticipants, participant_ ]
//                   : [ participant_ ]

//                 // 1.2.1.5.2.1.1  Construct the `UpdateCommand` to update the 
//                 //                `participant` property of the study entry in 
//                 //                the `studies` table. 
//                 const Key = {
//                   ownerEmail,
//                   createdAtTimestamp
//                 }
//                 const UpdateExpression = 'set participants = :participants'

//                 ExpressionAttributeValues = {
//                   ':participants': updatedParticipants
//                 }

//                 input = {
//                   TableName,
//                   Key,
//                   UpdateExpression,
//                   ExpressionAttributeValues
//                 }

//                 command = new UpdateCommand(input)


//                 const message = `'participants' property for study ID ${
//                   studyId
//                 } has been updated in the ${TableName} table`


//                 /**
//                  * @dev 1.2.1.5.2.1.2  Attempt to perform the `UpdateCommand` 
//                  *                     on DynamoDB to update the `participant` 
//                  *                     property on the study entry for this ID 
//                  *                     in the `studies` table
//                  */
//                 try {
//                   const response = await ddbDocClient.send(command)

//                   // console.log(`response: `, response)

//                   // Return `participantId`
//                   return NextResponse.json(
//                     {
//                       message,
//                       participantId,
//                     },
//                     {
//                       status: 200,
//                       headers: {
//                         'Content-Type': 'application/json',
//                       },
//                     }
//                   )
//                 } catch (error: any) {
//                   console.log(
//                     `Error performing Update operation on the '${
//                       TableName
//                     }' table to update the 'participants' property: `,
//                     error
//                   )

//                   // Something went wrong
//                   return NextResponse.json(
//                     { error: error },
//                     {
//                       status: 500,
//                       headers: {
//                         'Content-Type': 'application/json',
//                       },
//                     }
//                   )
//                 }
//               } else {
//                 return NextResponse.json(
//                   { message: 'Owner email does not exist' },
//                   {
//                     status: 404,
//                     headers: {
//                       'Content-Type': 'application/json'
//                     }
//                   },
//                 )
//               }
//             } catch (error: any) {
//               console.log(
//                 `Error using ID '${studyId}' to perform Query operation on '${
//                   TableName
//                 }' to get ownerEmail: `,
//                 error
//               )


//               // Error sending POST request to DynamoDB table
//               return NextResponse.json(
//                 { error: error },
//                 {
//                   status: 500,
//                   headers: {
//                     'Content-Type': 'application/json'
//                   }
//                 },
//               )
//             }
//           } catch (error: any) {
//             console.log(
//               `Error performing Update operation on EXISTING account entry in the '${
//                 TableName
//               }' to update the 'participant' property: `,
//               error
//             )

//             // Something went wrong
//             return NextResponse.json(
//               { error: error },
//               {
//                 status: 500,
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               }
//             )
//           }
//         }
//       }
      

//     /**
//      * @dev 1.2.2.0 If the user's email does not exist in the `accounts` table, 
//      *              use the current timestamp to create a completely NEW entry
//      */
//     } catch (error: any) {
//       // 1.2.2.1 Construct the `UpdateCommand` using the current timestamp to
//       //         send to DynamoDB
//       const Key = {
//         email: participant_.email,
//         createdAtTimestamp: Date.now() // Current timestamp
//       }
//       const UpdateExpression = 
//         'set participant = :participant, studies = :studies'
      
//       ExpressionAttributeValues = { 
//         ':participant': participant_,
//         ':studies': participant_.studies,
//       }

//       input = {
//         TableName,
//         Key,
//         UpdateExpression,
//         ExpressionAttributeValues
//       }

//       command = new UpdateCommand(input)


//       const successMessage = `Account entry for ${
//         participant.email
//       } has been updated in the ${TableName} table`


//       // 1.2.2.2 Attempt to perform the `UpdateCommand` on DynamoDB
//       try {
//         const response = await ddbDocClient.send(command)


//         /**
//          * @dev 2.0 Update the `participants` property of the study entry in the 
//          *          `studies` table.
//          */
//         TableName = DYNAMODB_TABLE_NAMES.studies

//         // 2.1 Construct `QueryCommand` to get the `ownerEmail` that we will use as
//         //     the partition/primary key to then perform the `UpdateCommand` to
//         //     update the same study entry's `participants` property.
//         const IndexName = 'id-index'

//         TableName = DYNAMODB_TABLE_NAMES.studies
//         KeyConditionExpression = 'id = :idValue'
//         ExpressionAttributeValues = { ':idValue': studyId }

//         input = {
//           TableName,
//           IndexName,
//           KeyConditionExpression,
//           ExpressionAttributeValues,
//         }

//         command = new QueryCommand(input)


//         // 2.2 Attempt to perform Query operation to get `ownerEmail` 
//         //     partition key and `timestamp` sort key: both are required for
//         //     `UpdateCommand`
//         try {
//           const response = await ddbDocClient.send(command)


//           // 2.2.1 If `ownerEmail` exists...
//           if (response.Items && response.Items.length > 0) {
//             const study = (response.Items as STUDY__DYNAMODB[])[0]

//             const ownerEmail = study.ownerEmail
//             const createdAtTimestamp = study.createdAtTimestamp
//             const previousParticipants = study.participants

//             // Update list of participants using existing participants.
//             const updatedParticipants: PARTICIPANT__DYNAMODB[] = previousParticipants
//               ? [ ...previousParticipants, participant_ ]
//               : [ participant_ ]


//             // 2.2.1.1 Construct the `UpdateCommand` to update the `participant`
//             //         property of the study entry in the `studies` table. 
//             const Key = { 
//               ownerEmail, 
//               createdAtTimestamp,
//             }
//             const UpdateExpression = 'set participants = :participants'

//             ExpressionAttributeValues = { ':participants': updatedParticipants }

//             input = {
//               TableName,
//               Key,
//               UpdateExpression,
//               ExpressionAttributeValues
//             }

//             command = new UpdateCommand(input)

//             const message = `'participants' property for study ID ${
//               studyId
//             } has been updated in the ${TableName} table`

//             /**
//              * @dev 2.2.1.2 Attempt to perform the `UpdateCommand` on DynamoDB to 
//              *              update the `participant` property on the study entry 
//              *              for this ID in the `studies` table
//              */
//             try {
//               const response = await ddbDocClient.send(command)

//               // console.log(`response: `, response)

//               // Return `participantId`
//               return NextResponse.json(
//                 {
//                   message,
//                   participantId,
//                 },
//                 {
//                   status: 200,
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                 }
//               )
//             } catch (error: any) {
//               console.log(
//                 `Error performing Update operation on the '${
//                   TableName
//                 }' table to update the 'participants' property: `,
//                 error
//               )

//               // Something went wrong
//               return NextResponse.json(
//                 { error: error },
//                 {
//                   status: 500,
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                 }
//               )
//             }
//           } else {
//             return NextResponse.json(
//               { message: 'Owner email does not exist' },
//               {
//                 status: 404,
//                 headers: {
//                   'Content-Type': 'application/json'
//                 }
//               },
//             )
//           }
//         } catch (error: any) {
//           console.log(
//             `Error using ID '${ studyId }' to perform Query operation on '${
//               TableName
//             }' to get ownerEmail: `, 
//             error
//           )

//           // Error sending POST request to DynamoDB table
//           return NextResponse.json(
//             { error: error },
//             {
//               status: 500,
//               headers: {
//                 'Content-Type': 'application/json'
//               }
//             },
//           )
//         }
//       } catch (error: any) {
//         console.log(
//           `Error performing Update operation on the NEW account entry '${
//             TableName
//           }' to update the 'participant' property: `, 
//           error
//         )

//         // Something went wrong
//         return NextResponse.json(
//           { error: error },
//           {
//             status: 500,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         )
//       }
//     }


//   } else {
//     return NextResponse.json(
//       { error: 'Method Not Allowed' },
//       {
//         status: 405,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       },
//     )
//   }
// }




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
      ExpressionAttributeValues: { [key: string]: any } = {
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
                } has been updated in the ${TableName
                } table to remove study with study ID '${studyId
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
              `Error performing Query operation on the '${TableName
              }' table to remove a study with study ID '${studyId
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
            `Error performing Update operation on the '${TableName
            }' table to remove a participant from study with study ID '${studyId
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