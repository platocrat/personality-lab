// Externals
import { 
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { 
  PutCommand, 
  QueryCommand, 
  PutCommandInput, 
  QueryCommandInput 
} from '@aws-sdk/lib-dynamodb'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  MAX_AGE, 
  ssmClient,
  COOKIE_NAME,
  ddbDocClient,
  LibsodiumUtils,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES, 
  DYNAMODB_TABLE_NAMES,
} from '@/utils'
import { BESSI_accounts } from '../email/route'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()

    let input: QueryCommandInput | PutCommandInput | GetParameterCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_ACCOUNTS,
      IndexName: 'UsernameIndex',
      KeyConditionExpression: 'username = :usernameValue',
      ExpressionAttributeValues: {
        ':usernameValue': username,
      }
    }

    let command: QueryCommand | PutCommand | GetParameterCommand = new QueryCommand(input)

    /**
     * @dev 1. Check if the username is already in the database
     */
    try {
      const response = await ddbDocClient.send(command)

      if (response.Items && response.Items.length > 0) {
        // Only return a response if the username exists in the DynamoDB Table
        if ((response.Items[0] as BESSI_accounts).username) {
          return NextResponse.json(
            { message: 'Username exists' },
            { status: 200 },
          )
        }
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: error },
        { status: 500 },
      )
    }
    
    /**
     * @dev 2. Store the new user's sign-up data
     */
    // Get timestamp after the username is validated.
    const timestamp = new Date().getTime()

    input = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_ACCOUNTS,
      Item: { 
        email: email,
        username: username, 
        password: password,
        timestamp: timestamp
      },
    }

    command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

      if (typeof JWT_SECRET === 'string') {
        const SECRET_KEY = await fetchAwsParameter(
          AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        )

        if (typeof SECRET_KEY === 'string') {
          const secretKeyUint8Array = LibsodiumUtils.base64ToUint8Array(
            SECRET_KEY
          )

          const encryptedEmail = await LibsodiumUtils.encryptData(
            email,
            secretKeyUint8Array
          )
          const encryptedUsername = await LibsodiumUtils.encryptData(
            username,
            secretKeyUint8Array
          )

          const encryptedTimestamp = await LibsodiumUtils.encryptData(
            timestamp.toString(),
            secretKeyUint8Array
          )

          /**
           * @dev Make sure the password that is stored in the cookie is hashed!
           */
          const token = sign(
            {
              email: encryptedEmail,
              username: encryptedUsername,
              password,
              timestamp: encryptedTimestamp
            },
            JWT_SECRET as string,
            { expiresIn: MAX_AGE.SESSION }
          )

          /**
           * @dev 5. Store the cookie
          */
          cookies().set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NEXT_NODE_ENV ? false : true,
            sameSite: 'strict',
            path: '/',
          })

          const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'

          return NextResponse.json(
            { message: 'User has successfully signed up' },
            {
              status: 200,
              headers: { 'Set-Cookie': cookieValue }
            },
          )
        } else {
          return SECRET_KEY as NextResponse<{ error: string }>
        }
      } else { // Return the error in the json of the `NextResponse`
        return JWT_SECRET as NextResponse<{ error: string }>
      }
    } catch (error: any) {
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