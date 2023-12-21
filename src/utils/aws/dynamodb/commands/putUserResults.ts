// Externals
import { PutCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { ddbDocClient } from '..'
import { BessiUserResults__DynamoDB } from '@/utils/bessi/types'


export async function putUserResults(
  userResults: BessiUserResults__DynamoDB
) {
  const command = new PutCommand({
    TableName: process.env.NEXT_TABLE_NAME,
    Item: {
      userId: userResults.userId,
      timestamp: userResults.timestamp,
      facetScores: userResults.facetScores,
      domainScores: userResults.domainScores,
      demographics: userResults.demographics,
    },
    ReturnValues: 'ALL_NEW',
    ReturnConsumedCapacity: 'TOTAL',
  })

  try {
    const response = await ddbDocClient.send(command)
    console.log(response)
    return response
  } catch (error) {
    throw error
  }
}