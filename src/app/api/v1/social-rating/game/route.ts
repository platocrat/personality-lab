// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  ddbDocClient, 
  DYNAMODB_TABLE_NAMES, 
  getEntryId, 
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'
import { 
  QueryCommand,
  QueryCommandInput, 
} from '@aws-sdk/client-dynamodb'
import { PutCommandInput, PutCommand } from '@aws-sdk/lib-dynamodb'



export async function PUT(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'PUT') {
    const { email, socialRatingGame } = await req.json()

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

    const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames
    const Item: SOCIAL_RATING_GAME__DYNAMODB = {
      ...socialRatingGame,
      timestamp: Date.now(),
    }
    
    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      const message = `Social rating game has been added to ${
        TableName
      } table`

      return NextResponse.json(
        {
          message,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error.message ?? error },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}




/**
 * @dev GET: single social rating game by `sessionId`.
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'GET') {
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames
    const IndexName = 'sessionId-index'
    const KeyConditionExpression = 'sessionId = :sessionIdValue'
    const ExpressionAttributeValues: any = { ':sessionIdValue': sessionId }

    const input: QueryCommandInput = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command: QueryCommand = new QueryCommand(input)


    try {
      const response = await ddbDocClient.send(command)
      const items = (response.Items as any) as SOCIAL_RATING_GAME__DYNAMODB[]

      if (!items) {
        const message = `No session ID found in ${TableName} table`

        return NextResponse.json(
          { message },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      } else {
        const socialRatingGame = items[0]

        return NextResponse.json(
          {
            socialRatingGame,
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
      console.error(`Error fetching social rating game with session ID '${sessionId}': `, error)

      // Something went wrong
      return NextResponse.json(
        { error: `Error fetching social rating game with session ID '${sessionId}': ${error.message}` },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        },
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