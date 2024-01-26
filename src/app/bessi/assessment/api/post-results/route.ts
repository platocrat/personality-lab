// Externals
import { NextRequest, NextResponse } from 'next/server'
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { BESSI_RESULTS_TABLE_NAME } from '@/utils'
import { ddbDocClient } from '@/utils/aws/dynamodb'


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { userResults } = await req.json()

    const input: PutCommandInput = {
      TableName: BESSI_RESULTS_TABLE_NAME,
      Item: {
        userId: userResults.userId,
        timestamp: userResults.timestamp,
        facetScores: userResults.facetScores,
        domainScores: userResults.domainScores,
        demographics: userResults.demographics,
      },
    }

    const command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)
      
      console.log(`response: `, response)

      const message = `User results have been added to ${BESSI_RESULTS_TABLE_NAME} table`

      return NextResponse.json(
        { message: message },
        { status: 200 }
      )
    } catch (error: any) {
      console.log(`error: `, error)

      // Something went wrong
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