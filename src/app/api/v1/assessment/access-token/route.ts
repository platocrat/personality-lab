// Externals
import {
  GetCommand,
  PutCommand,
  GetCommandInput,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { sign } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  MAX_AGE,
  ddbDocClient,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
  USER_RESULTS_ACCESS_TOKENS__DYNAMODB,
} from '@/utils'



export async function PUT(
  req: NextRequest,
  res: NextResponse,
): Promise<any> {
  if (req.method === 'PUT') {
    const {
      email,
      studyId,
      assessmentId,
      userResultsId,
    } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized: Email query parameter is required!' },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

    const TableName = DYNAMODB_TABLE_NAMES.userResultsAccessTokens

    /**
     * @todo 1. Encrypt the access token before it is stored to DynamoDB
     *       2. Make sure to decrypt the access token whenever it is retrieved.
     */
    if (typeof JWT_SECRET === 'string') {
      // Generate access token with a 30 minute expiry
      const accessToken = sign(
        { id: userResultsId },
        JWT_SECRET as string,
        { expiresIn: MAX_AGE.ACCESS_TOKEN }
      )

      const Item: USER_RESULTS_ACCESS_TOKENS__DYNAMODB = {
        accessToken, // Partition/Primary Key
        id: userResultsId, // Sort Key
        assessmentId,
        studyId,
      }

      // Write to table of `id` and `accessToken` in DynamoDB
      const input: PutCommandInput = {
        TableName,
        Item,
      }

      const command = new PutCommand(input)


      try {
        const response = await ddbDocClient.send(command)

        const message = `Access token has been added to ${
          DYNAMODB_TABLE_NAMES.userResultsAccessTokens
        } table`


        return NextResponse.json(
          {
            message,
            accessToken
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
          { error: error.message ?? error },
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      }
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
  res: NextResponse
): Promise<NextResponse<{ message: string }> | NextResponse<{
  accessToken: string
}> | NextResponse<{ error: any }>> {
  if (req.method === 'GET') {
    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized: Email query parameter is required!' },
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const { assessmentId, id } = await req.json()

    const TableName = DYNAMODB_TABLE_NAMES.userResultsAccessTokens
    const Key = { id: id }

    const input: GetCommandInput = { TableName, Key }
    const command = new GetCommand(input)


    try {
      const response = await ddbDocClient.send(command)

      if (!response.Item) {
        const message = `No access token found in ${
          TableName
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
        /**
         * @todo 1. Ensure that the access token is encrypted when it is 
         *          retrieved.
         *       2. Decrypt the access token.
         */
        const accessToken = response.Item.accessToken as string

        return NextResponse.json(
          { accessToken },
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