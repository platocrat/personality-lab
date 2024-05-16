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
  jwtErrorMessages,
  DYNAMODB_TABLE_NAMES,
  BessiUserResults__DynamoDB,
} from '@/utils'



/**
 * @dev Verifies the user's `accessToken` and tries to fetch the `userResults`
 *      that is mapped to the given `id`.
 * @param assessmentName
 * @param id
 * @param accessToken 
 * @param JWT_SECRET 
 * @returns 
 */
export async function verfiyAccessTokenAndFetchUserResults(
  assessmentName: string,
  id: string,
  accessToken: string,
  JWT_SECRET: string,
) {
  try {
    // 3. If verification of `accessToken` using JWT secret is successful,
    //    create DynamoDB `GetCommand` to fetch `id` from
    //    `DYNAMODB_TABLE_NAMES[assessmentName].userResultsAccessTokens`
    //    which will be used later to fetch the `userResults` from the
    //    `DYNAMODB_TABLE_NAMES[assessmentName].results` table.
    verify(accessToken, JWT_SECRET)

    const TableName = DYNAMODB_TABLE_NAMES[assessmentName].userResultsAccessTokens
    const Key = { id: id, accessToken: accessToken }

    const input: GetCommandInput = { TableName, Key}
    const command = new GetCommand(input)

    // console.log(`GetCommand to fetch the userResultsId that is mapped to the accessToken: `, command)


    // 4. Try to fetch `userResults` from DynamoDB table
    return await fetchUserResultsIdAndUserResults(assessmentName, command)
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
 * @dev Tries to fetch `userResults` object from DynamoDB.
 * @param command 
 * @returns 
*/
export async function fetchUserResultsIdAndUserResults(
  assessmentName: string,
  command: GetCommand
) {
  try {
    const response = await ddbDocClient.send(command)

    // 5. Throw an error if the results are not in the table
    if (!response.Item) {
      const message = `No access token found in ${
        DYNAMODB_TABLE_NAMES[assessmentName].userResultsAccessTokens
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
      // 6. Return the `id` if the access token exists.
      const userResultsId = response.Item.id

      // 7. Use `userResultsId` to fetch `userResults`
      return fetchUserResults(assessmentName, userResultsId)
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
 * @dev Returns `userResults` if they are in the DynamoDB table for the given 
 *      `id`.
 * @param userResultsId
 * @returns 
 */
export async function fetchUserResults(
  assessmentName: string,
  userResultsId: string
) {
  // 8. Build `QueryCommand` to fetch the `userResults` from the `BESSI-results` 
  //    table
  const TableName = DYNAMODB_TABLE_NAMES[assessmentName].results
  const KeyConditionExpression = 'id = :idValue'
  const ExpressionAttributeValues = { ':idValue': userResultsId }

  const input: QueryCommandInput = {
    TableName,
    KeyConditionExpression,
    ExpressionAttributeValues,
  }

  const command = new QueryCommand(input)


  try {
    const response = await ddbDocClient.send(command)

    // console.log(`response: `, response)

    if (response.Items && response.Items.length > 0) {
      if ((response.Items[0] as BessiUserResults__DynamoDB).id) {
        const userResults = response.Items[0] as BessiUserResults__DynamoDB

        return NextResponse.json(
          {
            message: 'id exists',
            data: userResults
          },
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          },
        )
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
          { message: 'User results `id` does not exist' },
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
        { message: 'User results `id` does not exist' },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }
  } catch (error: any) {
    const errorMessage = `Failed fetching 'userResults' from 'ID'`
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