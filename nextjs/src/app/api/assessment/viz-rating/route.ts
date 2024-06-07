// Externals
import {
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  hasJWT,
  getEntryId,
  ddbDocClient,
  RATINGS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


/**
 * @dev PUT `userResults`
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
    
    const { userVizRating } = await req.json()

    const userVizRatingId = await getEntryId(userVizRating)

    const TableName = DYNAMODB_TABLE_NAMES.vizRating
    const Item: RATINGS__DYNAMODB = {
      id: userVizRatingId,
      email: userVizRating.email as string,
      username: userVizRating.username as string,
      study: userVizRating.study as STUDY_SIMPLE__DYNAMODB,
      rating: userVizRating.rating as number,
      vizName: userVizRating.vizName as string,
      timestamp: Date.now(),
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
          userVizRatingId,
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