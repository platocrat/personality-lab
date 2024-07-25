// Externals
import {
  QueryCommand,
  QueryCommandInput
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  ddbDocClient,
  STUDY__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev GET: single study by `id`. This is a vanilla Next.js API route
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === 'GET') {
    const id = req.nextUrl.searchParams.get('id')

    const TableName = DYNAMODB_TABLE_NAMES.studies
    const IndexName = 'id-index'
    const KeyConditionExpression = 'id = :idValue'
    const ExpressionAttributeValues = { ':idValue': id }

    const input: QueryCommandInput = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command: QueryCommand = new QueryCommand(input)


    try {
      const response = await ddbDocClient.send(command)

      if (!(response.Items as STUDY__DYNAMODB[])) {
        const message = `No ID found in ${TableName} table`

        return NextResponse.json(
          { message: message },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      } else {
        const study = (response.Items as STUDY__DYNAMODB[])[0]

        return NextResponse.json(
          {
            study,
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
      console.error(`Error fetching study ID '${id}': `, error)

      // Something went wrong
      return NextResponse.json(
        { error: `Error fetching study ID '${id}': ${error.message}` },
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