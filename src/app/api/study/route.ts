// Externals
import {
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  PutCommandInput,
  ScanCommandInput,
  QueryCommandInput,
  DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  hasJWT,
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
export async function PUT(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'PUT') {
    hasJWT(cookies)

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
}


/**
 * @dev GET all studies for the `adminEmail` or get a single study by ID
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    hasJWT(cookies)

    const adminEmail = req.nextUrl.searchParams.get('adminEmail')

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


      const successMessage = `Scanned the '${TableName
        }' table and retrieved all studies for '${adminEmail
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


          const successMessage = `Fetched all studies from the '${TableName
            }' table for the owner email '${adminEmail
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
}



/**
 * @dev DELETE a study by its ID from the `studies` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export async function DELETE(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'DELETE') {
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
}