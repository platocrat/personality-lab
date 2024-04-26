// Externals
import {
  GetCommand,
  PutCommand,
  GetCommandInput,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { sign, decode } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  MAX_AGE,
  ddbDocClient,
  LibsodiumUtils,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



export async function POST(
  next: Function,
  req: NextRequest, 
  res: NextResponse, 
) {
  if (req.method === 'POST') {
    const { id } = await req.json()

    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

    // Generate access token with a 30 minute expiry
    const accessToken = sign(
      { id: id },
      JWT_SECRET as string,
      { expiresIn: MAX_AGE.ACCESS_TOKEN }
    )

    // Update the access token in DynamoDB
    const putCommandInput: PutCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS,
      Item: { 
        id: id,
        accessToken: accessToken,
      }
    }
    
    const command = new PutCommand(putCommandInput)
    

    try {
      const response = await ddbDocClient.send(command)

      const message = `Access token has been added to ${
        DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS
      } table`

      return NextResponse.json(
        { 
          message: message,
          data: accessToken
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  } else {
    const error = 'Method Not Allowed'

    return NextResponse.json(
      { error: error },
      { 
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}



/**
 * @dev GET `accessToken`
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const { id } = await req.json()

    const input: GetCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS,
      Key: { id: id },
    }

    const command = new GetCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      if (!response.Item) {
        const message = `No access token found in ${
          DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS
        } table`

        return NextResponse.json(
          { message: message },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      } else {
        return NextResponse.json(
          { data: response.Item },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: error },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  } else {
    const error = 'Method Not Allowed'

    return NextResponse.json(
      { error: error },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}