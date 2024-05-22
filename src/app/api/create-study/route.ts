// Externals
import { NextRequest, NextResponse } from 'next/server'
import { PutCommandInput, PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  getEntryId, 
  ddbDocClient,
  DYNAMODB_TABLE_NAMES, 
} from '@/utils'



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

    const TableName = DYNAMODB_TABLE_NAMES.study
    const Item = {
      id: study.id,
      name: study.name,
      url: study.url,
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