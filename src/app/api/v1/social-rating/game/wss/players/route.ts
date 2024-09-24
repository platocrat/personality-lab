/* /api/v1/social-rating/game/wss/players/route.ts */
// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
import { ReturnValue } from '@aws-sdk/client-dynamodb'
// Locals
import {
  Player,
  ddbDocClient,
  DYNAMODB_TABLE_NAMES,
  SocialRatingGamePlayers,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'




export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const {
      action,
      players,
      sessionId,
      isGameInSession,
    } = await req.json()

    if (action === 'updatePlayer') {
      const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames
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

          // Skip duplicate nickname check if the game is in session
          if (!isGameInSession) {
            // Check for duplicate nicknames
            const duplicateNicknames = Object.keys(
              players as SocialRatingGamePlayers
            ).filter((nickname: string): boolean => nickname in storedPlayers)

            if (duplicateNicknames.length > 0) {
              console.error(
                `Duplicate nicknames found: ${duplicateNicknames.join(', ')}`
              )

              // Handle the case where duplicates are found
              const message = `Nickname is taken! Please choose a different nickname.`

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
            }
          }

          const _updatedPlayers: SocialRatingGamePlayers = storedPlayers
            ? { ...storedPlayers, ...players }
            : { ...players }

          console.log(`_updatedPlayers: `, _updatedPlayers)

          const Key = {
            sessionId,
            createdAtTimestamp: storedCreatedAtTimestamp
          }
          const UpdateExpression =
            'set players = :players, updatedAtTimestamp = :updatedAtTimestamp'
          const ExpressionAttributeValues = {
            ':players': _updatedPlayers,
            ':updatedAtTimestamp': Date.now(),
          }
          const ReturnValues: ReturnValue = 'UPDATED_NEW'

          input = {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues,
          }

          command = new UpdateCommand(input)

          const message = `List of 'players' has been updated in the '${
            TableName
          }' table for social rating game with session ID '${sessionId}`

          try {
            const response = await ddbDocClient.send(command)

            const updatedPlayers_ = response.Attributes?.players as SocialRatingGamePlayers

            return NextResponse.json(
              {
                message,
                updatedPlayers: updatedPlayers_,
              },
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          } catch (error: any) {
            const errorMessage = `Failed to update 'players' of social rating game with session ID '${
              sessionId
            }' in the '${TableName}' table: `

            console.error(errorMessage, error)

            // Something went wrong
            return NextResponse.json(
              { error: `${errorMessage}: ${error}` },
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
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
          { error: `${errorMessage}: ${error}` },
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    } else {
      const error = `Invalid WebSocket action.`
      console.error(error)

      // Something went wrong
      return NextResponse.json(
        { 
          error,
        },
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