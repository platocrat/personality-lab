// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  PutCommand, 
  ScanCommand,
  PutCommandInput,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  getEntryId, 
  ddbDocClient,
  DYNAMODB_TABLE_NAMES,
  STUDY__DYNAMODB, 
} from '@/utils'
import study from '@/sections/admin-portal/studies/view/study'



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

    console.log(`studyId: `, studyId)

    const TableName = DYNAMODB_TABLE_NAMES.studies
    const Item = {
      id: study.id,
      name: study.name,
      isActive: study.isActive,
      timestamp: Date.now(),
      adminEmails: study.adminEmails,
      details: study.details
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `Study '${study.name}' has been added to the '${
      TableName
    }' table`


    try {
      const response = await ddbDocClient.send(command)

      console.log(`response: `, response)


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
      console.error(error)

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
  if (req.method === 'POST') {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail')

    const params = {
      TableName: 'your-table-name',
      FilterExpression: 'contains(adminEmails, :email)',
      ExpressionAttributeValues: {
        ':email': adminEmail
      }
    }

    const TableName = DYNAMODB_TABLE_NAMES.studies
    const FilterExpression = 'contains(adminEmails, :email)'
    const ExpressionAttributeValues = { ':email': adminEmail }

    const input: ScanCommandInput = { 
      TableName, 
      FilterExpression
    }
    const command = new ScanCommand(input)
    
    const successMessage = `Scanned the '${
      TableName
    }' table and retrieved all studies for '${
      adminEmail
    }'`


    try {
      const response = await ddbDocClient.send(command)

      console.log(`response: `, response)


      const message = successMessage || 'Operation successful'

      if (response.Items?.length === 0) {
        const message = `No studies were found with '${
            FilterExpression
          }' in the '${ TableName }' table`


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
        
        console.log(`studies: `, studies)


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