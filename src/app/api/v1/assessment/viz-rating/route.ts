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
  RATINGS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


/**
 * @dev PUT `userVizRating`
 * @param req 
 * @param res 
 * @returns 
 */
export async function PUT(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'PUT') {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized: Email query parameter is required!' },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    
    const { userVizRating } = await req.json()

    const userVizRatingId = await getEntryId(userVizRating)

    const TableName = DYNAMODB_TABLE_NAMES.vizRating
    
    let Item: RATINGS__DYNAMODB

    const study = userVizRating.study as STUDY_SIMPLE__DYNAMODB

    if (study) {
      Item = {
        id: userVizRatingId,
        email: userVizRating.email as string,
        study: userVizRating.study as STUDY_SIMPLE__DYNAMODB,
        rating: userVizRating.rating as number,
        vizName: userVizRating.vizName as string,
        timestamp: Date.now(),
      }
    } else {
      Item = {
        id: userVizRatingId,
        email: userVizRating.email as string,
        rating: userVizRating.rating as number,
        vizName: userVizRating.vizName as string,
        timestamp: Date.now(),
      }
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const message = `User data visualization rating has been added to ${
      DYNAMODB_TABLE_NAMES.vizRating
    } table`


    try {
      const response = await ddbDocClient.send(command)


      return NextResponse.json(
        {
          message,
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