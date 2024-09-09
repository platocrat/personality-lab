// Externals
import { NextRequest, NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  ddbDocClient,
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT__DYNAMODB,
} from '@/utils'
import {
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb'


/**
 * @dev GET all `participants` from `accounts` table
 * @param req 
 * @returns 
 */
export const GET = withApiAuthRequired(async function getParticipants(
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

    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const FilterExpression = 'attribute_exists(participant)'

    const input: ScanCommandInput = {
      TableName,
      FilterExpression,
    }
    const command = new ScanCommand(input)


    try {
      const response = await ddbDocClient.send(command)

      if (response.Items?.length === 0) {
        const message = `No accounts were found with ${
          FilterExpression
        } in the ${
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
        const participants = (response.Items as ACCOUNT__DYNAMODB[])?.map((
          account: ACCOUNT__DYNAMODB
        ): PARTICIPANT__DYNAMODB | undefined => {
            return account.participant
          }
        )

        return NextResponse.json(
          { 
            participants
          },
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
})