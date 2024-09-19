// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
// Locals
import {
  ddbDocClient,
  getEntryId,
  DYNAMODB_TABLE_NAMES,
  SocialRatingGamePlayer,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'




export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const { 
      sessionId,
      players,
    } = await req.json()

    const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames

    const players_ = players as SocialRatingGamePlayer

    const KeyConditionExpression = 'sessionId = :sessionIdValue'
    const ExpressionAttributeValues = { ':sessionIdValue': sessionId }

    let input: QueryCommandInput | UpdateCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    },
      command: QueryCommand | UpdateCommand = new QueryCommand(input)

    try {
      const response = await ddbDocClient.send(command)
      const Items = (response.Items as any) as SOCIAL_RATING_GAME__DYNAMODB[]

      if (Items[0].sessionId) {
        const socialRatingGame = Items[0]
        const storedPlayers = socialRatingGame.players || {}
        const storedCreatedAtTimestamp = socialRatingGame.createdAtTimestamp

        const updatedPlayers: SocialRatingGamePlayer = {
          ...storedPlayers,
          ...players_,
        }

        // 1.2.1.4 Construct the `UpdateCommand` to send to DynamoDB to update
        //         the `participant` attribute of the account entry in the
        //         `accounts` table.
        const Key = {
          sessionId,
          createdAtTimestamp: storedCreatedAtTimestamp
        }
        const UpdateExpression =
          'set players = :players, updatedAtTimestamp = :updatedAtTimestamp'
        const ExpressionAttributeValues = {
          ':players': updatedPlayers,
          ':updatedAtTimestamp': Date.now(),
        }

        input = {
          TableName,
          Key,
          UpdateExpression,
          ExpressionAttributeValues,
        }

        command = new UpdateCommand(input)

        const successMessage = `List of 'players' has been updated in the '${
          TableName
        }' table for social rating game with session ID '${
          sessionId
        }`

      } else {
        const error = `Social rating game with session ID '${
          sessionId
        }' not found in the '${TableName}' table`

        console.error(error)

        // Something went wrong
        return NextResponse.json(
          { error },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    } catch (error: any) {
      const errorMessage = `Social rating game with session ID '${
        sessionId
      }' not found in the '${TableName}' table`

      console.error(errorMessage, error)

      // Something went wrong
      return NextResponse.json(
        { error: `${errorMessage}: ${ error }` },
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
          'Content-Type': 'application/json',
        },
      },
    )
  }
}