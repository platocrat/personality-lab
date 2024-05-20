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
export async function getUserVizRatingId(userVizRating: {
  email: string
  username: string
  timestamp: string
  vizName: string
  rating: number
  assessmentName: string
}) {
  try {
    const SECRET_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY
    )

    if (typeof SECRET_KEY === 'string') {
      const secretKey: Uint8Array = LibsodiumUtils.base64ToUint8Array(
        SECRET_KEY
      )

      // Encrypt `userVizRating` properties
      const encryptedEmail: string = await LibsodiumUtils.encryptData(
        userVizRating.email,
        secretKey
      )
      const encryptedUsername: string = await LibsodiumUtils.encryptData(
        userVizRating.username,
        secretKey
      )
      const encryptedTimestamp: string = await LibsodiumUtils.encryptData(
        userVizRating.timestamp,
        secretKey
      )

      const encryptedAssessmentName: string = await LibsodiumUtils.encryptData(
        userVizRating.assessmentName,
        secretKey
      )

      const encryptedVizName: string = await LibsodiumUtils.encryptData(
        userVizRating.vizName,
        secretKey
      )
      const encryptedRating: string = await LibsodiumUtils.encryptData(
        userVizRating.rating.toString(),
        secretKey
      )

      const encryptedUserVizRating = {
        email: encryptedEmail,
        username: encryptedUsername,
        timestamp: encryptedTimestamp,
        vizName: encryptedVizName,
        rating: encryptedRating,
        assessmentName: encryptedAssessmentName,
      }

      const hashLength = 64

      // Represent ID of the encrypted user's results as a hash, in hexadecimal, 
      // of the userResults object
      const userVizRatingId = await LibsodiumUtils.genericHash(
        hashLength,
        JSON.stringify(encryptedUserVizRating),
        true // forces the return of ID as a hexadecimal string
      ) as string

      return userVizRatingId
    } else {
      throw new Error(
        `Error fetching ${AWS_PARAMETER_NAMES.RESULTS_ENCRYPTION_KEY}`
      )
    }
  } catch (error: any) {
    throw new Error(`Error getting ID for user viz rating: `, error)
  }
}