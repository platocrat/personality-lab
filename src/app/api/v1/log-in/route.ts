// Externals
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import {
  SSCrypto,
  ddbDocClient,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  verifiedEmailAndPasswordSwitch,
} from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const {
      email,
      // username,
      password, // Password is already hashed
    } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Unauthorized without email and password', },
        {
          status: 401,
        }
      )
    }

    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }

    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command = new QueryCommand(input)

    /**
     * @dev 1. Verify username and password
     */
    try {
      const response = await ddbDocClient.send(command)

      if (
        response.Items &&
        (response.Items[0] as ACCOUNT__DYNAMODB).password
      ) {
        const storedEmail = (response.Items[0] as ACCOUNT__DYNAMODB).email
        const storedPassword = (response.Items[0] as ACCOUNT__DYNAMODB).password
        const storedParticipant = (response.Items[0] as ACCOUNT__DYNAMODB).participant

        const verifiedEmail = storedEmail === email
        const verifiedPassword = new SSCrypto().verifyPassword(
          password,
          storedPassword.hash,
          storedPassword.salt,
        )

        const switchCondition = `${verifiedEmail}-${verifiedPassword}`

        return await verifiedEmailAndPasswordSwitch(
          switchCondition,
          cookies,
          email,
          // username,
          storedParticipant,
          storedPassword,
        ) as NextResponse<{ error: string }> | NextResponse<{ message: string }>
      } else {
        return NextResponse.json(
          { error: 'Email not found' },
          { status: 200 },
        )
      }
    } catch (error: any) {
      const errorMessage = `Cannot read properties of undefined (reading 'password')`

      if (error.message === errorMessage) {
        return NextResponse.json(
          { message: 'Email not found' },
          { status: 200 },
        )
      } else {
        return NextResponse.json(
          { error: error.message },
          { status: 500 },
        )
      }
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}