// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import {
  getEntryId,
  ddbDocClient,
  DYNAMODB_TABLE_NAMES,
  PARTICIPANT_DYNAMODB,
} from '@/utils'



/**
 * @dev POST: Update an `account` entry with the `participant` object as an 
 *      additional property.
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { participant } = await req.json()

    const participantId = await getEntryId(participant)

    const participant_: PARTICIPANT_DYNAMODB = {
      id: participantId,
      name: participant.name,
      email: participant.email,
      adminEmail: participant.adminEmail,
      adminUsername: participant.adminUsername,
      assessmentNames: participant.assessmentNames,
      isNobelLaureate: participant.isNobelLaureate,
      timestamp: participant.timestamp, 
    }

    const TableName = DYNAMODB_TABLE_NAMES.accounts
    const Key = { email: participant.email }
    const UpdateExpression = `set participant = :participant`
    const ExpressionAttributeValues = { ':participant': participant_ }

    const input: UpdateCommandInput = { 
      TableName, 
      Key, 
      UpdateExpression,
      ExpressionAttributeValues
    }

    const command = new UpdateCommand(input)

    const successMessage = `Account for ${ 
      participant.email 
    } has been update in the ${
      DYNAMODB_TABLE_NAMES.accounts
    } table`


    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


      return NextResponse.json(
        {
          message: message,
          data: participantId,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
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
}