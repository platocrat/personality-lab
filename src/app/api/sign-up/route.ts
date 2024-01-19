// Externals
import { 
  PutCommand, 
  QueryCommand, 
  PutCommandInput, 
  QueryCommandInput 
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'
import { BESSI_accounts } from '../check-email/route'


export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()

    let input: QueryCommandInput | PutCommandInput = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      IndexName: 'UsernameIndex',
      KeyConditionExpression: 'username = :usernameValue',
      ExpressionAttributeValues: {
        ':usernameValue': username,
      }
    }

    let command: QueryCommand | PutCommand = new QueryCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      console.log(`response: `, response)

      if (response.Items && response.Items.length > 0) {
        // Only return a response if the username exists in the DynamoDB Table
        if ((response.Items[0] as BESSI_accounts).username) {
          return NextResponse.json(
            { message: 'Username exists' },
            { status: 200 },
          )
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
        { status: 500 },
      )
    }
    
    // Get timestamp after the username is validated.
    const timestamp = new Date().getTime()

    input = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      Item: { 
        email: email,
        username: username, 
        password: password,
        timestamp: timestamp
      },
    }

    command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      return NextResponse.json(
        { message: 'User has successfully signed up!' },
        { status: 200 },
      )
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
        { status: 500 },
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}