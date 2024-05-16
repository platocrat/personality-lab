// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  PutCommand, 
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import { 
  ddbDocClient,
  getUserResultsId,
  DYNAMODB_TABLE_NAMES,
  handleDynamoDBPutResultsOrRating,
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

    const userResultsId = await getUserResultsId(userResults)

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

    
    await handleDynamoDBPutResultsOrRating(
      userResultsId,
      command,
      successMessage
    )
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