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

    console.log(`input: `, input)

    const command = new GetCommand(input)

    console.log(`command: `, command)

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