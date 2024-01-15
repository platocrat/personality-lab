// Externals
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    const input = {
      TableName: process.env.NEXT_BESSI_ACCOUNTS_TABLE_NAME,
      Key: { email },
    }

    console.log(
      `ddbDocClient.config.credentials():\n`,
      ddbDocClient.config.credentials()
    )

    const command = new GetCommand(input)

    try {
      const { Item } = await ddbDocClient.send(command)

      console.log(`Item: `, Item)

      if (!!(Item as any).email) {
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
        { error: error.message },
        { status: 500 },
      )
    }
  } else {
    console.error(
      `Method Not Allowed: This API endpoint only accepts POST requests`
    )

    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}