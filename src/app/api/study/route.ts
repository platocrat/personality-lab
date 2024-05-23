// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  PutCommand, 
  ScanCommand,
  QueryCommand,
  PutCommandInput,
  ScanCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  getEntryId, 
  ddbDocClient,
  STUDY__DYNAMODB, 
  DYNAMODB_TABLE_NAMES,
} from '@/utils'
import study from '@/sections/admin-portal/studies/view/study'
import error from 'next/error'



/**
 * @dev POST a new study entry to the `study` table in DynamoDB.
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { study } = await req.json()

    const studyId = await getEntryId(study)

    const TableName = DYNAMODB_TABLE_NAMES.studies
    const Item = {
      ...study,
      id: studyId,
      timestamp: Date.now(),
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
      // console.error(error)

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
 * @dev GET all studies for the `adminEmail`
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail')

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


      if (response.Items?.length === 0) {
        // Search `adminEmail` as `ownerEmail` instead
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
            const message = `'No studies found for '${ adminEmail }' in the ${
              TableName
            } table`

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