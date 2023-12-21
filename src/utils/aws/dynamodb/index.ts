// Externals
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
// Locals
import { REGION, getTemporaryCredentials } from '..'

const HOURS = 2
const ROLE_SESSION_NAME = 'DynamoDB'

const tempCredentials = await getTemporaryCredentials(HOURS, ROLE_SESSION_NAME)

const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: tempCredentials,
})

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)