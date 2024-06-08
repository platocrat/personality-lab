// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  RESULTS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  STUDY_SIMPLE__DYNAMODB,
  BessiUserResults__DynamoDB,
} from '@/utils'



/**
 * @dev POST: Update `results` of study entry in the `studies` table
 * @param req 
 * @param res 
 * @returns 
 */
export const POST = withApiAuthRequired(async function updateResults(
  req: NextRequest
) {
  if (req.method === 'POST') {
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

    const { userResults } = await req.json()

    const userResultsId = await getEntryId(userResults)

    const results: RESULTS__DYNAMODB = {
      id: userResultsId,
      email: userResults.email as string,
      study: userResults.study as STUDY_SIMPLE__DYNAMODB,
      results: userResults.results as BessiUserResults__DynamoDB,
      timestamp: Date.now(),
    }

    const study = userResults.study as STUDY_SIMPLE__DYNAMODB

    const ownerEmail = study.ownerEmail
    const createdAtTimestamp = study.createdAtTimestamp


    const TableName = DYNAMODB_TABLE_NAMES.studies
    const KeyConditionExpression = 'ownerEmail = :ownerEmailValue'
    const ExpressionAttributeValues = { ':ownerEmailValue': ownerEmail }
    const input: QueryCommandInput = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }
    const command: QueryCommand = new QueryCommand(input)
    
    
    try {
      const response = await ddbDocClient.send(command)      
      
      if ((response.Items as STUDY__DYNAMODB[])[0].ownerEmail) {
        const study = (response.Items as STUDY__DYNAMODB[])[0]
        const storedResults = study.results as RESULTS__DYNAMODB[]

        const updatedResults = storedResults
          ? [ ...storedResults, results ]
          : [ results ]

        const Key = {
          ownerEmail,
          createdAtTimestamp
        }
        const UpdateExpression =
          'set results = :results, updatedAtTimestamp = :updatedAtTimestamp'
        const ExpressionAttributeValues = {
          ':results': updatedResults,
          ':updatedAtTimestamp': Date.now()
        }

        const input = {
          TableName,
          Key,
          UpdateExpression,
          ExpressionAttributeValues,
        }

        const command = new UpdateCommand(input)

        const successMessage = `User results have been added to ${
          TableName
        } table`


        try {
          const response = await ddbDocClient.send(command)


          return NextResponse.json(
            {
              message: successMessage,
              userResultsId,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error: any) {
          console.log(
            `Could not update user results for study ID '${
              study.id
            }' of the '${ TableName }' table: `, 
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
        const error = `Owner email '${ownerEmail}' not found in '${TableName}' table`

        return NextResponse.json(
          { error },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }      
    } catch (error: any) {
      console.log(
        `Could not Query study ID '${ 
          study.id 
        }' using owner email '${ownerEmail}': `, 
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



/**
 * @dev GET `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export const GET = withApiAuthRequired(async function getResults(
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

    const email = req.nextUrl.searchParams.get('email')
    const studyId = req.nextUrl.searchParams.get('studyId')


    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required!' },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const TableName: string = DYNAMODB_TABLE_NAMES.studies
    const IndexName = 'email-timestamp-index'
    const KeyConditionExpression = 'email = :emailValue'
    const ExpressionAttributeValues = { ':emailValue': email }

    const input: QueryCommandInput = {
      TableName,
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    }

    const command: QueryCommand = new QueryCommand(input)

    const successMessage = `All user results have fetched from the ${
      TableName
    } table`


    try {
      const response = await ddbDocClient.send(command)
      
      console.log(`response: `, response)


      if ((response.Items as RESULTS__DYNAMODB[])?.length === 0) {
        const message = `No accounts were found with ${
          email
        } as their email in the ${ TableName } table`

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
        const allUserResults = response.Items as RESULTS__DYNAMODB[]


        return NextResponse.json(
          {
            message: successMessage,
            allUserResults,
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    } catch (error: any) {
      console.error(`Error: `, error)

      return NextResponse.json(
        { error: error.message },
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
          'Content-Type': 'application/json',
        },
      }
    )
  }
})