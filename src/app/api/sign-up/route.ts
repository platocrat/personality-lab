// Externals
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email, username, password } = req.body as any

    const input = {
      TableName: process.env.NEXT_BESSI_SIGN_IN_TABLE_NAME,
      Item: { email, username, password },
    }

    const command = new PutCommand(input)

    try {
      await ddbDocClient.send(command)

      return NextResponse.json(
        { message: 'User has successfully signed up!' },
        { status: 200 },
      )
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      )
    }
  } else {
    return NextResponse.json(
      {},
      { status: 405 },
    )
  }
}