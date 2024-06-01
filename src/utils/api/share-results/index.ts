// Externals
import { verify } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import {
  GetCommand,
  QueryCommand,
  GetCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
// Locals
import {
  ddbDocClient,
  STUDY__DYNAMODB,
  jwtErrorMessages,
  RESULTS__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  BessiUserResults__DynamoDB,
  USER_RESULTS_ACCESS_TOKENS__DYNAMODB,
} from '@/utils'



/**
 * @dev Verifies the user's `accessToken` and tries to fetch the `userResults`
 *      that is mapped to the given `id`.
 * @param id
 * @param accessToken 
 * @param JWT_SECRET 
 * @returns 
 */
export async function verfiyAccessTokenAndFetchUserResults(
  id: string,
  accessToken: string,
  JWT_SECRET: string,
) {
  try {
    // 3. If verification of `accessToken` using JWT secret is successful,
    //    create DynamoDB `GetCommand` to fetch the `id` from the
    //    `user-results-access-tokens` table. The `id` will be used later to
    //    fetch the user's `results` from the `studies` table.
    verify(accessToken, JWT_SECRET)

    const TableName = DYNAMODB_TABLE_NAMES.userResultsAccessTokens
    const Key = { id: id, accessToken: accessToken }

    const input: GetCommandInput = { TableName, Key }
    const command = new GetCommand(input)

    // 4. Send the `GetCommand` to fetch the `id` from the 
    //    `user-results-access-tokens` table, then try to fetch user's `results`
    //    from the `studies` table
    return await fetchUserResultsIdAndUserResults(command)
  } catch (error: any) {
    if (error.message === jwtErrorMessages.expiredJWT) {
      /**
       * @dev Access token expired and needs to be refreshed
       */
      return NextResponse.json(
        { error: `Access token expired` },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    } else {
      const errorMessage = `Failed verifying 'accessToken' and 'JWT_SECRET'`

      console.error(`${errorMessage}: `, error)

      // Something went wrong
      return NextResponse.json(
        { error: `${errorMessage}: ${error}` },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  }
}


/**
 * @dev Uses to get the `results` object from fetching a study item from the 
 *      `studies` table, using the `id` of the study that is fetched from the
 *      `user-results-access-tokens` table.
 * @param command 
 * @returns 
*/
export async function fetchUserResultsIdAndUserResults(
  command: GetCommand
) {
  try {
    const response = await ddbDocClient.send(command)

    // 5. Throw an error if the access token is not in the 
    //    `user-results-access-tokens` table.
    if (!(response.Item as USER_RESULTS_ACCESS_TOKENS__DYNAMODB)) {
      const message = `No access token found in ${
        DYNAMODB_TABLE_NAMES.userResultsAccessTokens
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
      // 6. Get the user's results `id` and `studyId` if the access token exists
      const item = response.Item as USER_RESULTS_ACCESS_TOKENS__DYNAMODB
      
      const studyId = item.studyId
      const userResultsId = item.id

      // 7. Use `userResultsId` to fetch `userResults`
      return fetchUserResults(studyId, userResultsId)
    }
  } catch (error: any) {
    const errorMessage = `Failed fetching 'id' using 'accessToken'`

    console.error(`${errorMessage}: `, error)

    // Something went wrong
    return NextResponse.json(
      { error: `${errorMessage}: ${error}` },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}


/**
 * @dev Returns `userResults` if they are in `studies` DynamoDB table for a 
 *      given `id`.
 * @param userResultsId
 * @returns 
 */
export async function fetchUserResults(
  studyId: string,
  userResultsId: string,
) {
  // 8. Build `QueryCommand` to fetch the user's `results` from the `studies` 
  //    table.
  const TableName = DYNAMODB_TABLE_NAMES.studies
  const IndexName = 'id-index'
  const KeyConditionExpression = 'id = :idValue'
  const ExpressionAttributeValues = { ':idValue': studyId }

  const input: QueryCommandInput = {
    TableName,
    IndexName,
    KeyConditionExpression,
    ExpressionAttributeValues,
  }

  const command = new QueryCommand(input)


  try {
    const response = await ddbDocClient.send(command)


    if (response.Items && response.Items.length > 0) { 
      if ((response.Items[0] as STUDY__DYNAMODB)) {
        const study = response.Items[0] as STUDY__DYNAMODB
        const results = study.results as RESULTS__DYNAMODB[] | undefined

        const userResults = results?.find(result => result.id === userResultsId)


        if (userResults) {
          return NextResponse.json(
            {
              message: 'id exists',
              userResults,
            },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        } else {
          return NextResponse.json(
            { message: `User results with ID '${userResultsId}' was not found` },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            },
          )
        }
      } else {
        /**
         * @dev This if/else statement is necessary so that the type signature 
         * of this function is:
         * 
         * Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }>>
         * 
         * and not:
         * 
         * Promise<NextResponse<{ message: string }> | NextResponse<{ error: any }> | undefined> 
         */
        return NextResponse.json(
          { message: `Study with ID '${studyId}' was not found` },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
      }
    } else {
      return NextResponse.json(
        { message: `Study with ID '${studyId}' was not found` },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  } catch (error: any) {
    const errorMessage = `Failed getting study entry with ID '${
      studyId
    }' from the '${
      TableName
    }' table`

    console.error(`${errorMessage}: `, error)

    // Something went wrong
    return NextResponse.json(
      { error: `${errorMessage}: ${error}` },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}