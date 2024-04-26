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
    const { userResults } = await req.json()

    const userResultsId = await getUserResultsId(userResults)

    const input: PutCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_RESULTS,
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
        DYNAMODB_TABLE_NAMES.BESSI_RESULTS
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



/**
 * @dev GET `userResults`
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'GET') {
    const { id, accessToken } = await req.json()

    // 1. Fetch JWT secret to verify if the user is authorized to access the 
    //    `userResults` mapped to the provided `id`.
    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

    if (typeof JWT_SECRET === 'string') {
      // 2. Verify `accessToken` using the JWT secret
      await verfiyAccessTokenAndFetchUserResults(accessToken, JWT_SECRET, id)
      
    } else { // Return the error in the json of the `NextResponse`
      return JWT_SECRET as NextResponse<{ error: string }>
    }
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}




// -----------------------------------------------------------------------------
// --------- Helper functions to clean up logic in API endpoints above ---------
// -----------------------------------------------------------------------------
/**
 * @dev Encrypts `userResults` properties to create a new encrypted version of
 *      `userResults` that is used to generate a unique `id`
 * @param userResults 
 * @returns 
 */
async function getUserResultsId(userResults: {
 email: string
 username: string
 timestamp: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
}): Promise<string> {
  const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)

  const secretKey: Uint8Array = LibsodiumUtils.base64ToUint8Array(
    JWT_SECRET as string
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
  const id = await LibsodiumUtils.genericHash(
    hashLength,
    JSON.stringify(encryptedUserResults),
    true // forces the return of ID as a hexadecimal string
  ) as string

  return id
}



/**
 * @dev Verifies the user's `accessToken` and tries to fetch the `userResults`
 *      that is mapped to the given `id`.
 * @param accessToken 
 * @param JWT_SECRET 
 * @param id 
 * @returns 
 */
async function verfiyAccessTokenAndFetchUserResults(
  accessToken: string, 
  JWT_SECRET: string, 
  id: string
) {
  try {
    verify(accessToken, JWT_SECRET)

    // 3. If verification of `accessToken` using JWT secret is successful,
    //    create DynamoDB `GetCommand`.
    const input: GetCommandInput = {
      TableName: DYNAMODB_TABLE_NAMES.BESSI_RESULTS,
      Key: { id: id },
    }

    const command = new GetCommand(input)

    // 4. Try to fetch `userResults` from DynamoDB table
    await fetchUserResults(command)
  } catch (error: any) {
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
async function fetchUserResults(command: GetCommand) {
  try {
    const response = await ddbDocClient.send(command)

    // 5. Throw an error if the results are not in the table
    if (!response.Item) {
      const message = `No user results found in ${DYNAMODB_TABLE_NAMES.BESSI_RESULTS} table`

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
      // 6. Return the `userResults` if the results exist.
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