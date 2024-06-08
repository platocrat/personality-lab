// Externals
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand,
  PutCommandInput,
  ScanCommandInput,
  QueryCommandInput,
  DeleteCommandInput,
  } from '@aws-sdk/lib-dynamodb'
  import { NextRequest, NextResponse } from 'next/server'
  import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev PUT a new study entry to the `studies` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export const PUT = withApiAuthRequired(async function putStudy(
  req: NextRequest
) {
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

    const TableName = DYNAMODB_TABLE_NAMES.studies
    const Item = {
      ...study,
      id: studyId,
      createdAtTimestamp: Date.now(),
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `Study '${study.name}' has been added to the '${
      TableName
    }' table`


    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


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
 * @dev GET all studies for the `adminEmail` or get a single study by ID
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

    const adminEmail = user.email as string

    // 1.0 Handle the case where adminEmail exists
    if (adminEmail) {
      const TableName = DYNAMODB_TABLE_NAMES.studies
      const FilterExpression = 'contains(adminEmails, :email)'

      let ExpressionAttributeValues = { ':email': adminEmail },
        input: ScanCommandInput | QueryCommandInput = {
          TableName,
          FilterExpression,
          ExpressionAttributeValues
        },
        command: ScanCommand | QueryCommand = new ScanCommand(input)


      const successMessage = `Scanned the '${
        TableName
      }' table and retrieved all studies for '${
        adminEmail
      }'`


      try {
        const response = await ddbDocClient.send(command)

        const message = successMessage || 'Operation successful'


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


          const successMessage = `Fetched all studies from the '${
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
                  message: successMessage,
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
              message: successMessage,
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
    // 2.0 Handle the case where `adminEmail` does not exist and `id` is used 
    //     as a GSI
    } else {
      const id = req.nextUrl.searchParams.get('id')

      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/app/api/study/route.ts" --function="getStudy()"]: id: `,
        id
      )

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
          const studies = (response.Items as STUDY__DYNAMODB[])
          console.log(
            `[${new Date().toLocaleString()}: --filepath="src/app/api/study/route.ts" --function="getStudy()"]: studies: `,
            studies
          )

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
        console.log(`Error fetching study ID '${id}': `, error)

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

      console.log(`response: `, response)
      
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
      console.log(
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