// Externals
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'


type BESSI_accounts = {
  password: string
  username: string
  email: string
  timestamp: number
}


export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    const input: QueryCommandInput = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      KeyConditionExpression: 'email = :emailValue',
      ExpressionAttributeValues: {
        ':emailValue': email,
      }
    }

    const command = new QueryCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && (response.Items[0] as BESSI_accounts).email) {
        return NextResponse.json(
          { message: 'Email exists!' },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { error: 'Email does not exist!' },
          { status: 400 },
        )
      }
    } catch (error: any) { // Error sending POST request to DynamoDB table
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