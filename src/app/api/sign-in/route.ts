// Externals
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  // if (req.method === 'POST') {
  //   const { email, password } = req.body as any

  //   const input = {
  //     TableName: process.env.NEXT_BESSI_SIGN_IN_TABLE_NAME,
  //     Key: { email },
  //   }

  //   const command = new GetCommand(input)

  //   try {
  //     const { Item } = await ddbDocClient.send(command)

  //     if (Item && Item.password === password) {
  //       return NextResponse.json(
  //         { message: 'User has successfully signed in!' },
  //         { status: 200 },
  //       )
  //     } else {
  //       return NextResponse.json(
  //         { error: 'Email and password do not match any known users.' },
  //         { status: 400 },
  //       )
  //     }
  //   } catch (error: any) {
  //     return NextResponse.json(
  //       { error: error.message },
  //       { status: 500 },
  //     )
  //   }
  // } else {
  //   return NextResponse.json(
  //     {},
  //     { status: 405 },
  //   )
  // }
}