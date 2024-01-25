// Externals
import { 
  PutCommand, 
  QueryCommand, 
  PutCommandInput, 
  QueryCommandInput 
} from '@aws-sdk/lib-dynamodb'
import { serialize } from 'cookie'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { MAX_AGE, COOKIE_NAME } from '@/utils/api'
import { ddbDocClient } from '@/utils/aws/dynamodb'
import { AWS_PARAMETER_NAMES, BESSI_ACCOUNTS_TABLE_NAME } from '@/utils'
import { BESSI_accounts } from '../check-email/route'
import { ssmClient } from '@/utils/aws/systems-manager'
import { GetParameterCommandInput, GetParameterCommand } from '@aws-sdk/client-ssm'



export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, username, password } = await req.json()

    let input: QueryCommandInput | PutCommandInput | GetParameterCommandInput = {
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
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
      TableName: BESSI_ACCOUNTS_TABLE_NAME,
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

      /**
       * @dev 3. Fetch the JWT secret from AWS Parameter Store
       */
      let secret = 'null'

      input = {
        Name: AWS_PARAMETER_NAMES.JWT_SECRET,
        WithDecryption: true,
      }

      command = new GetParameterCommand(input)

      try {
        const response = await ssmClient.send(command)

        if (response.Parameter?.Value) {
          /**
           * @dev 4. Set secret, to be used when creating the signed JWT
           */
          secret = response.Parameter?.Value
        } else {
          return NextResponse.json(
            { error: `${ AWS_PARAMETER_NAMES.JWT_SECRET } parameter does not exist` },
            { status: 400 }
          )
        }
      } catch (error: any) {
        // Something went wrong
        return NextResponse.json(
          { error: `Error! Something went wrong fetching ${ AWS_PARAMETER_NAMES.JWT_SECRET }: ${ error }`, },
          { status: 400, },
        )
      }

      const token = sign(
        { email, username, password },
        secret,
        { expiresIn: MAX_AGE }
      )

      const serializedCookieWithToken = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NEXT_NODE_ENV ? false : true,
        sameSite: 'strict',
        path: '/',
      })

      // Format cookie to proper format for verification (done later)
      const _cookie = serializedCookieWithToken.slice(
        serializedCookieWithToken.indexOf('=') + 1,
        serializedCookieWithToken.indexOf(';')
      )

      /**
       * @dev 5. Store the cookie
       */
      cookies().set(COOKIE_NAME, _cookie)

      return NextResponse.json(
        { message: 'User has successfully signed up' },
        {
          status: 200,
          headers: { 'Set-Cookie': serializedCookieWithToken }
        },
      )
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