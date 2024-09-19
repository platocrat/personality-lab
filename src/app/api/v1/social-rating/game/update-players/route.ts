// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { ReturnValue } from '@aws-sdk/client-dynamodb'
// Locals
import {
  Player,
  getEntryId,
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
      sessionId,
      players,
    } = await req.json()

    const ipAddress = req.headers['x-forwarded-for']
    const players_ = players as SocialRatingGamePlayers

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

        // Check for duplicate nicknames
        const hasDuplicateNicknames = Object.keys(players_).filter(
          (nickname: string): boolean => nickname in storedPlayers
        )

        if (hasDuplicateNicknames.length > 0) {
          console.error(
            `Duplicate nicknames found: ${hasDuplicateNicknames.join(', ')}`
          )
          
          // Handle the case where duplicates are found
          const message = `Nickname already taken. Please choose a different nickname.`

          return NextResponse.json(
            { message },
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        } else {
          const hasJoined = players_[0].hasJoined
          const joinedAtTimestamp = Date.now()

          const newPlayer = {
            hasJoined,
            ipAddress,
            joinedAtTimestamp,
          } as Player

          const updatedPlayers: SocialRatingGamePlayers = {
            ...storedPlayers,
            newPlayer,
          }

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
          }' table for social rating game with session ID '${
            sessionId
          }`

          try {
            const response = await ddbDocClient.send(command)

            const updatedPlayers = response.Attributes?.players

            return NextResponse.json(
              {
                message,
                updatedPlayers,
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