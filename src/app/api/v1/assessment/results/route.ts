// Externals
import {
  GetCommand,
  PutCommand,
  GetCommandInput,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
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
 * @dev PUT: new results to the `results` DynamoDB table
 * @param req 
 * @param res 
 * @returns 
 */
export async function PUT(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<{
  message: string
  userResultsId: string 
}> | NextResponse<{ error: any }>> {
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
    
    const message = `User results have been added to '${ TableName }' table`

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
        `Could not update user results for study ID '${
          studyId
        }' of the '${TableName}' table: `,
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
}



/**
 * @dev GET
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'GET') {
    const id = req.nextUrl.searchParams.get('id')
    const studyId = req.nextUrl.searchParams.get('studyId')
    
    const TableName: string = DYNAMODB_TABLE_NAMES.results

    // 1. If querying database for an individual results entry by its `id`...
    if (id && !studyId) {
      const Key = { id }

      const input: GetCommandInput = { TableName, Key }
      const command = new GetCommand(input)

      const message = `Results with id '${id}' have fetched from the '${
        TableName
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
    // 2. If querying database for all results entries by their `studyId`...
    } else if (studyId && !id) {
      const IndexName = 'studyId-index'
      const KeyConditionExpression: string = 'studyId = :studyIdValue'
      const ExpressionAttributeValues = { ':studyIdValue': studyId }

      const input: QueryCommandInput = {
        TableName,
        IndexName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      }
      const command: QueryCommand = new QueryCommand(input)

      const message = `Results with id '${id}' have fetched from the '${
        TableName
      }' table`


      try {
        const response = await ddbDocClient.send(command)

        const resultsPerStudyId = (response.Items as any) as RESULTS__DYNAMODB[]

        return NextResponse.json(
          {
            message,
            resultsPerStudyId,
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
    // If neither `studyId` nor `id` are provided in the GET request
    } else {
      const error = `Error: 'id' and 'studyId' are required as search parameters`
      console.error(error)

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
      }
    )
  }
}