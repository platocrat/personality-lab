/* /api/v1/social-rating/game/wss/aws/players/route.ts */
// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { ReturnValue } from '@aws-sdk/client-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  GamePhases,
  ddbDocClient,
  PHASE_CHECKS,
  DYNAMODB_TABLE_NAMES,
  haveAllPlayersCompleted,
  SocialRatingGamePlayers,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'




export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  console.log(`req: `, req)

  if (req.method === 'POST') {
    const {
      action,
      players,
      sessionId,
      isGameInSession,
    } = await req.json()

    if (action === 'updatePlayer') {
      console.log(`action: `, action)

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

          // console.log(`_updatedPlayers: `, _updatedPlayers)

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

            // console.log(`updatedPlayers_: `, updatedPlayers_)

            // Get the next game phase from `_updatedPlayers`
            const nextPhase: GamePhases | undefined = PHASE_CHECKS.find(
              ({ check }): boolean => haveAllPlayersCompleted(
                updatedPlayers_, 
                check
              )
            )?.phase

            console.log(`nextPhase: `, nextPhase)

            // If phase changes, update the game's phase in DynamoDB
            if (nextPhase) {
              const phase = nextPhase

              const Key = {
                sessionId,
                createdAtTimestamp: storedCreatedAtTimestamp
              }
              const UpdateExpression =
                'set phase = :phase, updatedAtTimestamp = :updatedAtTimestamp'
              const ExpressionAttributeValues = {
                ':phase': phase,
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

              const message = `'phase' has been updated in the '${
                TableName
              }' table for social rating game with session ID '${
                sessionId
              }`

              try {
                const response = await ddbDocClient.send(command)

                const phase_ = response.Attributes?.phase as GamePhases

                return NextResponse.json(
                  {
                    message,
                    updatedPlayers: updatedPlayers_,
                    newPhase: phase_,
                  },
                  {
                    status: 200,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
              } catch (error: any) {
                const errorMessage = `Failed to update 'phase' of social rating game with session ID '${
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
            }
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