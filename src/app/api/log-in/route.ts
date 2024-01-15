// Externals
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email, password } = await req.json()

    const input = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
      Key: { email },
    }

    const command = new GetCommand(input)

    try {
      const { Item } = await ddbDocClient.send(command)

      if (Item && Item.password === password) {
        return NextResponse.json(
          { message: 'User has successfully logged in!' },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { error: 'Email and password do not match any known users.' },
          { status: 400 },
        )
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
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