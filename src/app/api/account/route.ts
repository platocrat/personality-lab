// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
} from '@/utils'



/**
 * @dev GET an account entry from the `accounts` table using a user's `email`
 * @param req 
 * @param res
 * @returns 
 */
export const GET = withApiAuthRequired( async function getAccountEntry(
  req: NextRequest
) {
  if (req.method === 'GET') {
    const res = new NextResponse()

    // Auth0
    const session = await getSession(req, res)
    const user = session?.user

    if (!user) {
      const message = `Unauthorized: Auth0 found no 'user' for their session.`
      return NextResponse.json(
        { message },
        {
          status: 401,
        }
      )
    }


    const email = user.email

    if (!email) {
      return NextResponse.json(
        { error: `Unauthorized: Auth0 found no email for this user's session!` },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    /**
     * @dev 1.0 Construct `QueryCommand` to fetch the user's account 
     *          entry from the `accounts` table.
     */
    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const KeyConditionExpression: string = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }
    
    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }
    const command: QueryCommand = new QueryCommand(input)

    const successMessage = `Found account entry for '${
      email
    }' in the ${TableName} table`


    try {
      const response = await ddbDocClient.send(command)


      if (
        response.Items &&
        (response.Items[0] as ACCOUNT__DYNAMODB).email
      ) {
        const account = (response.Items[0] as ACCOUNT__DYNAMODB)

        const message = successMessage || 'Operation successful'


        // Return account entry
        return NextResponse.json(
          {
            message,
            account,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } else {
        const message = `No account found for '${email}' in '${TableName}' table`

        return NextResponse.json(
          { message: message },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        ) 
      }
    } catch (error: any) {
      console.log(
        `Error getting account entry from the '${TableName}' table: `,
        error
      )

      // Something went wrong
      return NextResponse.json(
        { error: error },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
})