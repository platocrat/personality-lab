// Externals
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const { email } = await req.json()
    
    const timestamp = new Date().getTime()

    const input = {
      TableName: process.env.NEXT_BESSI_ACCOUNTS_TABLE_NAME,
      Key: { 
        email: email,
        timestamp: timestamp
      },
    }

    const command = new GetCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      if (response.Item === undefined || response.Item.email === undefined) {
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