// Externals
import { NextRequest, NextResponse } from 'next/server'
import {
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import {
  ddbDocClient,
  getUserResultsId,
  DYNAMODB_TABLE_NAMES,
} from '@/utils'



/**
 * @dev POST `userResults`
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

    const TableName = DYNAMODB_TABLE_NAMES.participants
    const Item = {
      id: participantId,
      name: participant.name, 
      email: participant.email, 
      adminEmail: participant.adminEmail, 
      adminUsername: participant.adminUsername, 
      assessmentName: participant.assessmentName, 
      isNobelLaureate: participant.isNobelLaureate, 
      timestamp: participant.timestamp, 
    }

    const input: PutCommandInput = { TableName, Item }
    const command = new PutCommand(input)

    const successMessage = `User results have been added to ${DYNAMODB_TABLE_NAMES.results
      } table`


    try {
      const response = await ddbDocClient.send(command)

      const message = successMessage || 'Operation successful'


      return NextResponse.json(
        {
          message: message,
          data: userResultsId,
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