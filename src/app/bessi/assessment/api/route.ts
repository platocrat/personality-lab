// Externals
import { NextRequest, NextResponse } from 'next/server'
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
// Locals
import { BESSI_RESULTS_TABLE_NAME } from '@/utils'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { BessiUserResults__DynamoDB } from '@/utils/bessi/types'


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

      return NextResponse.json(
        { message: 'User results have been added to `BESSI-results` table' },
        { status: 200 }
      )
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