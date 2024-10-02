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
  DYNAMODB_TABLE_NAMES,
  SOCIAL_RATING_GAME__DYNAMODB
} from '@/utils'




/**
 * POST: Updates two game states: `isGameInSession` and the game's `phase`, 
 *       from `lobby` to `consent-form`
 * @param req
 * @param res
 * @returns
 */
export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'POST') {
    const {
      phase,
      sessionId,
      isGameInSession,
    } = await req.json()

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
        const storedCreatedAtTimestamp = socialRatingGame.createdAtTimestamp

        const Key = {
          sessionId,
          createdAtTimestamp: storedCreatedAtTimestamp
        }
        const UpdateExpression =
          'set phase = :phase, isGameInSession = :isGameInSession, updatedAtTimestamp = :updatedAtTimestamp'
        const ExpressionAttributeValues = {
          ':phase': phase,
          ':isGameInSession': isGameInSession,
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

        const message = `'isGameInSession' and 'phase' has been updated in the '${
          TableName
        }' table for social rating game with session ID '${
          sessionId
        }`

        try {
          const response = await ddbDocClient.send(command)

          const phase_ = response.Attributes?.phase as GamePhases
          const isGameInSession_ = response.Attributes?.isGameInSession as boolean

          return NextResponse.json(
            {
              message,
              phase: phase_,
              isGameInSession: isGameInSession_,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error: any) {
          const errorMessage = `Failed to update 'isGameInSession' and 'phase' of social rating game with session ID '${
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