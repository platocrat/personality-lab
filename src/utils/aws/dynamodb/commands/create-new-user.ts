import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '..'

export const createNewUser = async (userId: string) => {
  const command = new PutCommand({
    TableName: process.env.NEXT_TABLE_NAME,
    Item: {
      userId: userId,
      books: {} // 
    },
    // ReturnValues: 'ALL_OLD',
  })

  try {
    const response = await ddbDocClient.send(command)
    console.log(response)
    return response
  } catch (error) {
    throw error
  }
}