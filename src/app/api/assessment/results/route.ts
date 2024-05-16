// Externals
import { NextRequest, NextResponse } from 'next/server'
import { 
  GetCommand, 
  PutCommand, 
  PutCommandInput,
  GetCommandInput, 
} from '@aws-sdk/lib-dynamodb'
import { verify } from 'jsonwebtoken'
// Locals
import { 
  MAX_AGE,
  COOKIE_NAME,
  ddbDocClient,
  LibsodiumUtils,
  FacetFactorType,
  getUserResultsId,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  DYNAMODB_TABLE_NAMES,
  SkillDomainFactorType,
  BessiUserDemographics__DynamoDB,
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
    const { assessmentName,userResults } = await req.json()

    const userResultsId = await getUserResultsId(userResults)

    const input: PutCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES[assessmentName].results,
      Item: {
        id: userResultsId,
        email: userResults.email,
        timestamp: userResults.timestamp,
        facetScores: userResults.facetScores,
        domainScores: userResults.domainScores,
        demographics: userResults.demographics,
      },
    }

    const command = new PutCommand(input)

    try {
      const response = await ddbDocClient.send(command)

      const message = `User results have been added to ${
        DYNAMODB_TABLE_NAMES[assessmentName].results
      } table`

      return NextResponse.json(
        { 
          message: message,
          data: userResultsId,
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
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