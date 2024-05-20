// Externals
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  ddbDocClient,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES, 
} from '@/utils'



export async function POST(
  req: NextRequest, 
  res: NextResponse
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email } = await req.json()

    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }

    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command = new QueryCommand(input)


    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && response.Items.length > 0) {
        if ((response.Items[0] as ACCOUNT__DYNAMODB).email) {
          return NextResponse.json(
            { message: 'Email exists' },
            { status: 200 },
          )
        } else { 
          /**
           * @dev This if/else statement is necessary so that the type signature 
           * of this function is:
           * 
           * Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>>
           * 
           * and not:
           * 
           * Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }> | undefined> 
           */
          return NextResponse.json(
            { message: 'Email does not exist' },
            { status: 200 },
          )
        }
      } else {
        return NextResponse.json(
          { message: 'Email does not exist' },
          { status: 200 },
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