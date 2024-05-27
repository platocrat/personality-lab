// Externals
import {
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
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
    const { userVizRating } = await req.json()

    const userVizRatingId = await getEntryId(userVizRating)

    const TableName = DYNAMODB_TABLE_NAMES.vizRating
    const Item = {
      id: userVizRatingId,
      email: userVizRating.email,
      rating: userVizRating.rating,
      vizName: userVizRating.vizName,
      username: userVizRating.username,
      timestamp: Date.now(),
      study: userVizRating.study,
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `User data visualization rating has been added to ${
      DYNAMODB_TABLE_NAMES.vizRating
    } table`


    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


      return NextResponse.json(
        {
          message: message,
          data: userVizRatingId,
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