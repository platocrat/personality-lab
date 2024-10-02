
// Externals
import { verify } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
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
  ACCOUNT__DYNAMODB,
  DYNAMODB_TABLE_NAMES,
  BessiUserResults__DynamoDB,
  USER_RESULTS_ACCESS_TOKENS__DYNAMODB,
} from '@/utils'
import { getSession } from '@auth0/nextjs-auth0'



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
  req: NextRequest,
  email?: string,
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
    return await fetchUserResultsIdAndUserResults(command, req, email)
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
  command: GetCommand,
  req: NextRequest,
  email?: string,
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
      
      const studyId = item.studyId // possibly `undefined`
      const userResultsId = item.id

      // 7. Use `userResultsId` to fetch `userResults`
      return fetchUserResults(userResultsId, req)
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
 * @param userResultsId
 * @returns 
 */
export async function fetchUserResults(
  id: string,
  req: NextRequest,
) {
  const TableName: string = DYNAMODB_TABLE_NAMES.results
  const Key = { id }

  const input: GetCommandInput = { TableName, Key }
  const command = new GetCommand(input)

  const message = `Results with id '${id}' have fetched from the '${
    TableName
  }' table`


  try {
    const response = await ddbDocClient.send(command)

    const userResults = response.Item as RESULTS__DYNAMODB

    return NextResponse.json(
      {
        message,
        userResults,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
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
}