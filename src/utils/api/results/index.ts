// Externals
import { verify } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { GetCommandInput, GetCommand } from '@aws-sdk/lib-dynamodb'
// Locals
import { 
  ddbDocClient,
  LibsodiumUtils,
  FacetFactorType, 
  fetchAwsParameter,
  AWS_PARAMETER_NAMES, 
  DYNAMODB_TABLE_NAMES,
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB,
} from '@/utils'



// -----------------------------------------------------------------------------
// ----- Helper functions to clean up logic in `/api/results` API endpoints ----
// -----------------------------------------------------------------------------
/**
 * @dev Encrypts `userResults` properties to create a new encrypted version of
 *      `userResults` that is used to generate a unique `id`
 * @param userResults 
 * @returns 
 */
export async function getUserResultsId(userResults: {
  email: string
  username: string
  timestamp: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
}) {
  try {
    /**
     * @todo Change `COOKIE_ENCRYPTION_SECRET_KEY` to use `JWT_SECRET`
     */
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
    )
    
    if (typeof SECRET_KEY === 'string') {
      const secretKey: Uint8Array = LibsodiumUtils.base64ToUint8Array(
        SECRET_KEY
      )

      // Encrypt `userResults` properties
      const encryptedEmail: string = await LibsodiumUtils.encryptData(
        userResults.email,
        secretKey
      )
      const encryptedUsername: string = await LibsodiumUtils.encryptData(
        userResults.username,
        secretKey
      )
      const encryptedTimestamp: string = await LibsodiumUtils.encryptData(
        userResults.timestamp,
        secretKey
      )
      const encryptedFacetScores: string = await LibsodiumUtils.encryptData(
        JSON.stringify(userResults.facetScores),
        secretKey
      )
      const encryptedDomainScores: string = await LibsodiumUtils.encryptData(
        JSON.stringify(userResults.domainScores),
        secretKey
      )
      const encryptedDemographics: string = await LibsodiumUtils.encryptData(
        JSON.stringify(userResults.demographics),
        secretKey
      )

      const encryptedUserResults = {
        email: encryptedEmail,
        timestamp: encryptedTimestamp,
        facetScores: encryptedFacetScores,
        domainScores: encryptedDomainScores,
        demographics: encryptedDemographics,
      }

      const hashLength = 64

      // Represent ID of the encrypted user's results as a hash, in hexadecimal, 
      // of the userResults object
      const userResultsId = await LibsodiumUtils.genericHash(
        hashLength,
        JSON.stringify(encryptedUserResults),
        true // forces the return of ID as a hexadecimal string
      ) as string

      return userResultsId
    } else {
      throw new Error(
        `Error fetching ${ AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY }`
      )
    }
  } catch (error: any) {
    throw new Error(`Error getting ID for user results: `, error)
  }
}



/**
 * @dev Verifies the user's `accessToken` and tries to fetch the `userResults`
 *      that is mapped to the given `id`.
 * @param accessToken 
 * @param JWT_SECRET 
 * @param id 
 * @returns 
 */
export async function verfiyAccessTokenAndFetchUserResults(
  accessToken: string,
  JWT_SECRET: string,
) {
  try {
    verify(accessToken, JWT_SECRET)

    // 3. If verification of `accessToken` using JWT secret is successful,
    //    create DynamoDB `GetCommand` to fetch `id` from the 
    //    `BESSI_USER_RESULT_ACCESS_TOKENS` which will be used later to fetch 
    //    the `userResults` from the `BESSI-results` table. 
    const input: GetCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS,
      Key: { 
        accessToken: accessToken
      },
    }

    const command = new GetCommand(input)
    
    // 4. Try to fetch `userResults` from DynamoDB table
    return await fetchUserResultsIdAndUserResults(command)
  } catch (error: any) {
    console.error(`Failed verifying 'accessToken' and 'JWT_SECRET'`)

    // Something went wrong
    return NextResponse.json(
      { error: error, },
      { status: 400, },
    )
  }
}


/**
 * @dev Tries to fetch `userResults` object from DynamoDB.
 * @param command 
 * @returns 
*/
export async function fetchUserResultsIdAndUserResults(command: GetCommand) {
  try {
    const response = await ddbDocClient.send(command)

    console.log(`response fetching 'id' using 'accessToken': `, response)
    
    // 5. Throw an error if the results are not in the table
    if (!response.Item) {
      const message = `No access token found in ${
        DYNAMODB_TABLE_NAMES.BESSI_USER_RESULT_ACCESS_TOKENS
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

      console.log(`userResultsId: `, userResultsId)

      // 7. Use `userResultsId` to fetch `userResults`
      return fetchUserResults(userResultsId)
    }
  } catch (error: any) {
    /**
     * @todo ---------------------------- HERE ---------------------------------
     */
    console.error(`Failed fetching 'id' using 'accessToken'`)

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
}


/**
 * @dev Returns `userResults` if they are in the DynamoDB table for the given 
 *      `id`.
 * @param id 
 * @returns 
 */
export async function fetchUserResults(
  userResultsId: string
) {
  // 8. Build `GetCommand` to fetch the `userResults` from the `BESSI-results` 
  //    table
  const input: GetCommandInput = {
    TableName: DYNAMODB_TABLE_NAMES.BESSI_RESULTS,
    Key: {
      id: userResultsId
    },
  }

  const command = new GetCommand(input)

  try {
    const response = await ddbDocClient.send(command)

    console.log(`response fetching 'userResults' from ID: `, response)

    if (!response.Item) {
      const message = `No user results found in ${
        DYNAMODB_TABLE_NAMES.BESSI_RESULTS
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
      // 9. Return the `userResults` if the results exist.
      return NextResponse.json(
        { data: response.Item },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  } catch (error: any) {
    console.error(`Failed fetching 'userResults' from 'ID'`)

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
}