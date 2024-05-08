// Externals
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  REGION,
  // CREDENTIALS,
} from '..'

const HOURS = 2

const ddbClient = new DynamoDBClient({ region: REGION })
// const ddbClient = new DynamoDBClient({ 
//   region: REGION,
//   credentials: CREDENTIALS
// })

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)