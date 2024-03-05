// Externals
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
// Locals
import { REGION } from '..'

const HOURS = 2

const ddbClient = new DynamoDBClient({ region: REGION })

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)