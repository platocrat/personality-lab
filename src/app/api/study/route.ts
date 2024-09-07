// Externals
import {
  PutCommand,
  ScanCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  PutCommandInput,
  ScanCommandInput,
  QueryCommandInput,
  DeleteCommandInput,
  UpdateCommandInput,
  } from '@aws-sdk/lib-dynamodb'
  import { NextRequest, NextResponse } from 'next/server'
  import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev PUT a new study entry to the `studies` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export const PUT = withApiAuthRequired(async function putStudy(
  // use `any` to get hide long and opaque type error from Next.js
  req: any
)  {
  if (req.method === 'PUT') {
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

    const { study } = await req.json()

    const studyId = await getEntryId(study)

    // Perform `Update` operation on the user's account in the `accounts`
    // table to update the `isAdmin` value of the account's `studiesAsAdmin` 
    // property.
    let TableName = DYNAMODB_TABLE_NAMES.accounts

    const adminEmails: string[] | undefined = study.adminEmails

    // 1. If there are admin emails...
    if (adminEmails) {
      let email: string = ''

      const isAdmin = true

      // 1.1 Perform `Update` operation on each admin email, updating their
      //     `studiesAsAdmin` property
      for (let i = 0; i < adminEmails.length; i++) {
        email = adminEmails[i]

        // Use the account's `email` to perform a `Query` operation to get
        //       its `createdAtTimestamp`.
        let TableName = DYNAMODB_TABLE_NAMES.accounts,
          KeyConditionExpression: string = 'email = :emailValue',
          ExpressionAttributeValues: { [key: string]: any } = {
            ':emailValue': email,
          },
          input: QueryCommandInput | UpdateCommandInput | PutCommandInput = {
            TableName,
            KeyConditionExpression,
            ExpressionAttributeValues,
          },
          command: QueryCommand | UpdateCommand | PutCommand = new QueryCommand(
            input
          )

        // 1.1.2. Try to perform `Query` operation to find the account by its 
        //        `email`
        try {
          const response = await ddbDocClient.send(command)

          // Check if the user's email exists in the `accounts` table
          if (
            response.Items &&
            (response.Items[0] as ACCOUNT__DYNAMODB).email
          ) {
            // Use the account's `createdAtTimestamp` property to
            // perform an `Update` operation to update the account's
            // `studiesAsAdmin` property.
            const account = response.Items[0] as ACCOUNT__DYNAMODB
            
            const createdAtTimestamp = account.createdAtTimestamp
            const previousStudiesAsAdmin = account?.studiesAsAdmin
            const studyAsAdmin = [
              {
                // `isAdmin` is set to `true` because the email is a part of 
                // `adminEmails`.
                isAdmin,
                id: study.id,
                name: study.name,
              }
            ]

            const updatedStudiesAsAdmin = previousStudiesAsAdmin
              ? [ ...previousStudiesAsAdmin, studyAsAdmin ]
              : [ studyAsAdmin ]

            const Key = {
              email,
              createdAtTimestamp
            }
            const UpdateExpression =
              'set studiesAsAdmin = :studiesAsAdmin, updatedAtTimestamp = :updatedAtTimestamp'
            const ExpressionAttributeValues = {
              ':studiesAsAdmin': updatedStudiesAsAdmin,
              ':updatedAtTimestamp': Date.now()
            }

            let input: UpdateCommandInput | PutCommandInput = {
              TableName,
              Key,
              UpdateExpression,
              ExpressionAttributeValues,
            },
              command: UpdateCommand | PutCommand = new UpdateCommand(input)

            // Try to perform `Update` operation.
            try {
              const response = await ddbDocClient.send(command)

              // Perform `Put` operation to add the new study to the `studies` 
              // table.
              TableName = DYNAMODB_TABLE_NAMES.studies

              const Item = {
                ...study,
                id: studyId,
                createdAtTimestamp: Date.now(),
              }

              input = { TableName, Item } as PutCommandInput
              command = new PutCommand(input)

              const message = `Study '${
                study.name
              }' has been added to the '${TableName}' table`

              try {
                const response = await ddbDocClient.send(command)


                return NextResponse.json(
                  {
                    message,
                    studyId,
                  },
                  {
                    status: 200,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
              } catch (error: any) {
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
                `Could not update 'studiesAsAdmin' for '${
                  email
                }' of the '${TableName}' table: `,
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
          }
        // 1.1.3. If the user's email does not exist in the `accounts` table, 
        //        use the current timestamp to create a completely NEW account 
        //        entry
        } catch (error: any) {
          // Construct the `UpdateCommand` using the current timestamp to send 
          // to DynamoDB
          const Key = {
            email: email,
            createdAtTimestamp: Date.now() // Current timestamp
          }
          const UpdateExpression =
            'set studiesAsAdmin = :studiesAsAdmin'

          const studyAsAdmin = [
            {
              // `isAdmin` is set to `true` because the email is a part of 
              // `adminEmails`.
              isAdmin,
              id: study.id,
              name: study.name,
            }
          ]

          const studiesAsAdmin = [ studyAsAdmin ]

          ExpressionAttributeValues = {
            ':studiesAsAdmin': studiesAsAdmin,
          }

          input = {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues
          }

          command = new UpdateCommand(input)

          // 1.1.4. Perform `Put` operation to add the new study to the 
          //        `studies` table.
          try {
            const response = await ddbDocClient.send(command)

            TableName = DYNAMODB_TABLE_NAMES.studies

            const Item = {
              ...study,
              id: studyId,
              createdAtTimestamp: Date.now(),
            }

            input = { TableName, Item }
            command = new PutCommand(input)

            const message = `Study '${study.name
              }' has been added to the '${TableName}' table`

            try {
              const response = await ddbDocClient.send(command)

              return NextResponse.json(
                {
                  message,
                  studyId,
                },
                {
                  status: 200,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              )
            } catch (error: any) {
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
              `Error performing Update operation for the NEW account entry '${
                TableName
              }' to update the 'participant' property: `,
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
        }
      }
    // 2. If there are NO `adminEmails`...
    } else {
      // 2.1 Perform the `Put` operation as you normally would
      // Perform `Put` operation to add the new study to the `studies` 
      // table.
      TableName = DYNAMODB_TABLE_NAMES.studies

      const Item = {
        ...study,
        id: studyId,
        createdAtTimestamp: Date.now(),
      }

      const input = { TableName, Item } as PutCommandInput
      const command = new PutCommand(input)

      const message = `Study '${
        study.name
      }' has been added to the '${TableName}' table`

      try {
        const response = await ddbDocClient.send(command)


        return NextResponse.json(
          {
            message,
            studyId,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } catch (error: any) {
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
})



/**
 * @dev GET all studies for the `adminEmail` or get a single study by `id`
 * @param req 
 * @param res 
 * @returns 
 */
export const GET = withApiAuthRequired(async function getStudy(
  req: NextRequest
) { 
  if (req.method === 'GET') {
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

    const id = req.nextUrl.searchParams.get('id')

    // 1.0 Handle the case where `id` exists
    if (id) {
      const TableName = DYNAMODB_TABLE_NAMES.studies
      const IndexName = 'id-index'
      const KeyConditionExpression = 'id = :idValue'
      const ExpressionAttributeValues = { ':idValue': id }

      const input: QueryCommandInput = {
        TableName,
        IndexName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      }

      const command: QueryCommand = new QueryCommand(input)


      try {
        const response = await ddbDocClient.send(command)

        if (!(response.Items as STUDY__DYNAMODB[])) {
          const message = `No ID found in ${TableName} table`

          return NextResponse.json(
            { message: message },
            {
              status: 404,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        } else {
          const study = (response.Items as STUDY__DYNAMODB[])[0]

          return NextResponse.json(
            {
              study,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        }
      } catch (error: any) {
        console.error(`Error fetching study ID '${id}': `, error)

        // Something went wrong
        return NextResponse.json(
          { error: `Error fetching study ID '${id}': ${error.message}` },
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      }

    // 2.0 Handle the case where `adminEmail` does not exist and `id` is used 
    //     as a GSI
    } else {
      const adminEmail = user.email as string

      const TableName = DYNAMODB_TABLE_NAMES.studies
      const FilterExpression = 'contains(adminEmails, :email)'

      let ExpressionAttributeValues = { ':email': adminEmail },
        input: ScanCommandInput | QueryCommandInput = {
          TableName,
          FilterExpression,
          ExpressionAttributeValues
        },
        command: ScanCommand | QueryCommand = new ScanCommand(input)


      const message = `Scanned the '${
        TableName
      }' table and retrieved all studies for '${
        adminEmail
      }'`


      try {
        const response = await ddbDocClient.send(command)

        // 1.1 Search `ownerEmail` for `adminEmail`
        if (response.Items?.length === 0) {
          const KeyConditionExpression = `ownerEmail = :email`

          ExpressionAttributeValues = { ':email': adminEmail }
          input = {
            TableName,
            KeyConditionExpression,
            ExpressionAttributeValues
          }

          command = new QueryCommand(input)


          const message = `Fetched all studies from the '${
            TableName
          }' table for the owner email '${
            adminEmail
          }'`


          try {
            const response = await ddbDocClient.send(command)

            if (response.Items && response.Items.length > 0) {
              const studies = (response.Items as STUDY__DYNAMODB[])

              return NextResponse.json(
                {
                  message,
                  studies,
                },
                {
                  status: 200,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
            } else {
              const message = `'No studies found for '${
                adminEmail
              }' in the ${TableName} table`

              // Something went wrong
              return NextResponse.json(
                { message: message },
                {
                  status: 404,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              )
            }
          } catch (error: any) {
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
          // 1.2 Return list of studies if the `adminEmail` was found in the
          //     `adminEmails` attribute
          const studies = (response.Items as STUDY__DYNAMODB[])

          return NextResponse.json(
            {
              message,
              studies,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        }
      } catch (error: any) {
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
})



/**
 * @dev DELETE a study by its ID from the `studies` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export const DELETE = withApiAuthRequired(async function deleteStudy(
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
      createdAtTimestamp,
    } = await req.json()


    const TableName = DYNAMODB_TABLE_NAMES.studies
    const Key = {
      ownerEmail,
      createdAtTimestamp,
    }

    const input = {
      TableName,
      Key,
    } as DeleteCommandInput

    const command = new DeleteCommand(input)

    const message = `Study ID '${
      studyId
    }' has been deleted from the '${TableName}' table`
    
    try {
      const response = await ddbDocClient.send(command)
      
      // Success
      return NextResponse.json(
        { message },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error(
        `Could not delete study ID '${studyId}' from the '${TableName}' table: `,
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



/**
 * @dev POST: Update an existing study using DynamoDB's `UpdateCommand`
 */
export const POST = withApiAuthRequired(async function updateStudy(
  req: NextRequest
) {
  if (req.method === 'POST') {
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

    const email = user.email as string

    if (!email) {
      return NextResponse.json(
        { error: `Unauthorized: Auth0 found no email for this user's session!` },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const { study } = await req.json()

    const study_ = study as STUDY__DYNAMODB
    const isOwnerOrAdmin = email === study_.ownerEmail || 
      study_.adminEmails?.includes(email)

    if (!isOwnerOrAdmin) {
      const message = 'Email provided in the request is not an owner nor admin'
      return NextResponse.json(
        { 
          message: `Unauthorized: ${ message }`,
        },
        {
          status: 401,
        }
      )
    }


    const TableName = DYNAMODB_TABLE_NAMES.studies
    const Item: STUDY__DYNAMODB = {
      ...study_,
      updatedAtTimestamp: Date.now(),
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const message = `Study '${study.name}' has been updated in the '${
      TableName
    }' table`


    try {
      const response = await ddbDocClient.send(command)


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