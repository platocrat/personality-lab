// Externals
import {
  PutCommand,
  QueryCommand,
  PutCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  Player,
  ddbDocClient,
  DYNAMODB_TABLE_NAMES,
  SocialRatingGamePlayers,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'




export async function PUT(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'PUT') {
    const { email, socialRatingGame } = await req.json()

    if (!email) {
      const error = `Unauthorized: 'email' query parameter is required!`

      return NextResponse.json(
        { 
          error,
        },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const requestHeaders = req.headers
    
    const sessionId: string = socialRatingGame.sessionId
    const players = socialRatingGame.players as SocialRatingGamePlayers
    
    const playerNickname: string = Object.keys(players)[0]
    
    const hasJoined = players[playerNickname].hasJoined
    const ipAddress = requestHeaders.get('x-forwarded-for') as string
    const inGameState = players[playerNickname].inGameState
    const joinedAtTimestamp = Date.now()

    const player: Player = {
      hasJoined,
      ipAddress,
      inGameState,
      joinedAtTimestamp
    }

    const players_: SocialRatingGamePlayers = {
      [ playerNickname ]: player
    }

    const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames
    const Item: SOCIAL_RATING_GAME__DYNAMODB = {
      ...socialRatingGame,
      players: players_,
      createdAtTimestamp: Date.now(),
    }
    
    const input: PutCommandInput = { TableName, Item }
    const command: PutCommand = new PutCommand(input)

    const message = `Social rating game with '${
      sessionId
    }' has been added to ${ TableName } table`

    try {
      const response = await ddbDocClient.send(command)

      return NextResponse.json(
        {
          message,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      const errorMessage = `Could not 'PUT' social rating game with session ID '${
        sessionId
      }' to the '${TableName}' table: `

      console.error(errorMessage, error)

      // Something went wrong
      return NextResponse.json(
        { error: `${ errorMessage }: ${ error }` },
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
    // `sessionId` is only present when `hostEmail` is not.
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    // `hostEmail` is only present when `sessionId` is not.
    const hostEmail = req.nextUrl.searchParams.get('hostEmail')

    const TableName = DYNAMODB_TABLE_NAMES.socialRatingGames

    if (sessionId && !hostEmail) {
      const IndexName = 'sessionId-index'
      const KeyConditionExpression = 'sessionId = :sessionIdValue'
      const ExpressionAttributeValues = { ':sessionIdValue': sessionId }

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

        if (items.length > 0) {
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
        } else {
          const message = `No social rating game entry found for sessionId`
          const error = `${message} '${ sessionId }' in '${TableName}' table`

          return NextResponse.json(
            { 
              message,
              error,
            },
            {
              status: 404,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        }
      } catch (error: any) {
        // Error sending POST request to DynamoDB table
        const isExpiredTokenException = error.name === 'ExpiredTokenException'

        if (isExpiredTokenException) {
          return NextResponse.json(
            { error: 'ExpiredTokenException: AWS access keys have expired.' },
            { 
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        } else {
          const errorMessage = `Session ID '${sessionId
            }' does not exist in '${TableName}' table`

          console.error(`${errorMessage}: `, error)

          // Something went wrong
          return NextResponse.json(
            {
              message: 'sessionId does not exist',
              error: errorMessage,
            },
            {
              status: 404,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        }
      }
    // GET game using `hostEmail` as the Global Secondary Index, being used as 
    // the Partition/Primary Key.
    } else if (hostEmail && !sessionId) {
      const IndexName = 'hostEmail-index'
      const KeyConditionExpression = 'hostEmail = :hostEmailValue'
      const ExpressionAttributeValues = { ':hostEmailValue': hostEmail }

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

        if (items.length > 0) {
          // Filter the queried items for the single active game.
          const socialRatingGame = items.filter((
            item: SOCIAL_RATING_GAME__DYNAMODB
          ): boolean => item.isActive === true)[0]

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
        } else {
          const message = `No social rating game entry found for hostEmail`
          const error = `${message} '${ hostEmail }' in '${TableName}' table`

          return NextResponse.json(
            { 
              message,
              error,
            },
            {
              status: 404,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        }
      } catch (error: any) {
        const errorMessage = `Host email '${
          hostEmail
        }' does not exist in '${TableName}' table`

        console.error(`${errorMessage}: `, error)

        // Something went wrong
        return NextResponse.json(
          {
            message: 'hostEmail does not exist',
            error: errorMessage,
          },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      }
    } else {
      const error = `Unauthorized: a 'sessionId' or 'hostEmail' URL search parameter is required!`
      
      return NextResponse.json(
        { error },
        {
          status: 401,
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