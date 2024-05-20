// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  PutCommand, 
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import { 
  getEntryId,
  ddbDocClient,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev POST `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { userResults } = await req.json()

    const userResultsId = await getEntryId(userResults)

    const TableName = DYNAMODB_TABLE_NAMES.results
    const Item = {
      id: userResultsId,
      email: userResults.email,
      timestamp: userResults.timestamp,
      facetScores: userResults.facetScores,
      domainScores: userResults.domainScores,
      demographics: userResults.demographics,
      assessmentName: userResults.assessmentName,
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `User results have been added to ${
      DYNAMODB_TABLE_NAMES.results
    } table`

    
    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


      return NextResponse.json(
        {
          message: message,
          data: userResultsId,
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