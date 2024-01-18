// Externals
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()

    const timestamp = new Date().getTime()

    const input = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      Item: { 
        email: email,
        username: username, 
        password: password,
        timestamp: timestamp
      },
    }

    const command = new PutCommand(input)

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