// Externals
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  GetCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  getEntryId,
  ddbDocClient,
  RESULTS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev POST: Update `results` attribute on the `studies` or `accounts` table
 * @param req 
 * @returns 
 */
export const PUT = withApiAuthRequired(async function updateResults(
  req: NextRequest
) {
  if (req.method === 'PUT') {
    const { userResults } = await req.json()

    const userResultsId = await getEntryId(userResults)

    const TableName = DYNAMODB_TABLE_NAMES.results
    const studyId = userResults.studyId

    const Item: RESULTS__DYNAMODB = {
      ...userResults,
      id: userResultsId,
      timestamp: Date.now(),
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const message = `User results have been added to '${TableName}' table`

    try {
      const response = await ddbDocClient.send(command)

      return NextResponse.json(
        {
          message,
          userResultsId,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error(
        `Could perform PUT operation to add new user results to the '${
          TableName
        }' table: `,
        error
      )

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



/**
 * @dev GET `userResults`
 * @param req 
 * @returns 
 */
export const GET = withApiAuthRequired(async function getResults(
  req: NextRequest
) {
  if (req.method === 'GET') {
    const id = req.nextUrl.searchParams.get('id')

    const TableName: string = DYNAMODB_TABLE_NAMES.results
    const Key = { id }

    const input: GetCommandInput = { TableName, Key }
    const command = new GetCommand(input)

    const message = `Results with id '${id}' have fetched from the '${TableName
      }' table`


    try {
      const response = await ddbDocClient.send(command)

      const userResults = response.Item as RESULTS__DYNAMODB

      return NextResponse.json(
        {
          message,
          userResults,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error(`Error: `, error)

      return NextResponse.json(
        { error: error.message },
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
      }
    )
  }
})