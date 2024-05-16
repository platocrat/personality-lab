// Externals
import { NextResponse } from 'next/server'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient, DYNAMODB_TABLE_NAMES } from '@/utils/aws'



export async function handleDynamoDBPutResultsOrRating(
  dataId: string,
  command: PutCommand,
  successMessage: string
) {
  try {
    const response = await ddbDocClient.send(command)

    const message = successMessage || 'Operation successful'


    return NextResponse.json(
      {
        message: message,
        data: dataId,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error: any) {
    // Something went wrong
    return NextResponse.json(
      { error: error },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
