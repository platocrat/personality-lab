// Externals
import {
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  ddbDocClient,
  getUserVizRatingId,
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
    const { userVizRating } = await req.json()

    const userVizRatingId = await getUserVizRatingId(userVizRating)

    const TableName = DYNAMODB_TABLE_NAMES.vizRating
    const Item = {
      id: userVizRatingId,
      email: userVizRating.email,
      timestamp: userVizRating.timestamp,
      vizName: userVizRating.facetScores,
      rating: userVizRating.domainScores,
      assessmentName: userVizRating.assessmentName,
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `User data visualization rating has been added to ${
      DYNAMODB_TABLE_NAMES.vizRating
    } table`


    await handleDynamoDBPutResultsOrRating(
      userVizRating,
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