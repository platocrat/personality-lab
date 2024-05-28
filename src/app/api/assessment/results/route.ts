// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  PutCommand, 
  QueryCommand,
  PutCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import { 
  getEntryId,
  ddbDocClient,
  RESULTS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  StudySimple__DynamoDB,
  BessiUserResults__DynamoDB,
} from '@/utils'



/**
 * @dev POST `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { userResults } = await req.json()

    const userResultsId = await getEntryId(userResults)

    const TableName = DYNAMODB_TABLE_NAMES.results
    const Item: RESULTS__DYNAMODB = {
      id: userResultsId,
      email: userResults.email as string,
      username: userResults.username as string,
      study: userResults.study as StudySimple__DynamoDB,
      results: userResults.results as BessiUserResults__DynamoDB,
      timestamp: Date.now(),
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `User results have been added to ${
      TableName
    } table`

    
    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


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
 * @dev GET `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const email = req.nextUrl.searchParams.get('email')


    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required!' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const TableName: string = DYNAMODB_TABLE_NAMES.results
    const IndexName = 'email-timestamp-index'
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }

    const input: QueryCommandInput = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command: QueryCommand = new QueryCommand(input)

    const successMessage = `All user results have fetched from the ${
      TableName
    } table`


    try {
      const response = await ddbDocClient.send(command)
      
      console.log(`response: `, response)


      if ((response.Items as RESULTS__DYNAMODB[])?.length === 0) {
        const message = `No accounts were found with ${
          email
        } as their email in the ${ TableName } table`

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
        const allUserResults = response.Items as RESULTS__DYNAMODB[]


        return NextResponse.json(
          {
            message: successMessage,
            allUserResults,
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
}