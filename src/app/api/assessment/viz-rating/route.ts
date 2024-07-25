// Externals
import {
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
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
export const PUT = withApiAuthRequired(async function putUserVizRating(
  req: NextRequest
) {
  if (req.method === 'PUT') {
    const res = new NextResponse()

    // Auth0
    const session = await getSession(req, res)
    const user = session?.user

    if (!user) {
      const message = `Unauthorized: Auth0 found no 'user' for their session.`
      return NextResponse.json(
        { message },
        {
          status: 401,
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
})