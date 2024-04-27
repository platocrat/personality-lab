// Locals
import { 
  LibsodiumUtils,
  FacetFactorType, 
  fetchAwsParameter,
  AWS_PARAMETER_NAMES, 
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB,
} from '@/utils'



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
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY
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
        `Error fetching ${ AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY }`
      )
    }
  } catch (error: any) {
    throw new Error(`Error getting ID for user results: `, error)
  }
}