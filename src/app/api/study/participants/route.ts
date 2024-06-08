// Externals
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  hasJWT,
  ddbDocClient,
  ParticipantType,
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
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    hasJWT(cookies)

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
}