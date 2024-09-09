// Externals
import {
  QueryCommand,
  UpdateCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { NextRequest, NextResponse } from 'next/server'
// Locals
import {
  getEntryId,
  ddbDocClient,
  STUDY__DYNAMODB,
  ACCOUNT__DYNAMODB,
  RESULTS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  STUDY_SIMPLE__DYNAMODB,
  BessiUserResults__DynamoDB,
} from '@/utils'



/**
 * @dev POST: Update `results` attribute on the `studies` or `accounts` table
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse<{
  message: string
  userResultsId: string 
}> | NextResponse<{ error: any }>> {
  if (req.method === 'POST') {
    const { email, userResults } = await req.json()

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

    const userResultsId = await getEntryId(userResults)

    const study = userResults.study as STUDY_SIMPLE__DYNAMODB | undefined

    // If `study` exists, update the `results` of the study entry in the 
    // `studies` table
    if (study) {
      const results: RESULTS__DYNAMODB = {
        id: userResultsId,
        email: userResults.email as string,
        study,
        results: userResults.results as BessiUserResults__DynamoDB,
        timestamp: Date.now(),
      }

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
            ? [...storedResults, results]
            : [results]

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
            console.error(
              `Could not update user results for study ID '${study.id
              }' of the '${TableName}' table: `,
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
          const error = `Owner email '${
            ownerEmail
          }' not found in '${TableName}' table`

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
        console.error(
          `Could not Query study ID '${study.id
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
    // If `study` is undefined, update `results` attribute of the account
    // entry in the `accounts` table
    } else {
      const accountEmail = userResults.email as string

      const results: RESULTS__DYNAMODB = {
        id: userResultsId,
        email: accountEmail,
        results: userResults.results as BessiUserResults__DynamoDB,
        timestamp: Date.now(),
      }

      const TableName = DYNAMODB_TABLE_NAMES.accounts
      const KeyConditionExpression = 'email = :email'
      const ExpressionAttributeValues = { ':email': accountEmail }

      const input: QueryCommandInput = {
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      }
      const command: QueryCommand = new QueryCommand(input)


      try {
        const response = await ddbDocClient.send(command)

        if ((response.Items as ACCOUNT__DYNAMODB[])[0].email) {
          const account = (response.Items as ACCOUNT__DYNAMODB[])[0]
          const email = account.email
          
          const createdAtTimestamp = account.createdAtTimestamp
          const storedResults = account.results as RESULTS__DYNAMODB[]

          const updatedResults = storedResults
            ? [ ...storedResults, results ]
            : [ results ]

          const Key = {
            email,
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

          const message = `User results have been added to ${
            TableName
          } table`


          try {
            const response = await ddbDocClient.send(command)


            return NextResponse.json(
              {
                message,
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
              `Could not update user results for '${
                email
              }' in the '${TableName}' table: `,
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
          const error = `No account for '${
            accountEmail
          }' was found in '${
            TableName
          }' table`

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
        console.error(
          `Could not Query account for '${accountEmail}': `,
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



/**
 * @dev GET `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>> {
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
}