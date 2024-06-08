// Externals
import { decode } from 'jsonwebtoken'
// Locals
import { 
  SSCrypto,
  CookieType,
  AWS_PARAMETER_NAMES,
} from '@/utils'




export async function getAccessToken(
  assessmentId: string,
  userResultsId: string,
  studyId: string,
) {
  if (!userResultsId) {
    /**
     * @todo Replace the line below by handling the error on the UI here
     */
    throw new Error(
      `Error: 'userResultsId' is invalid, see 'userResultsId': ${
        userResultsId
      }!`
    )
  } else {
    try {
      const response = await fetch('/api/assessment/access-token', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          assessmentId, 
          userResultsId, 
          studyId,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const accessToken = json.accessToken
        return accessToken
      } else {
        const error = `Error posting ${ 
          assessmentId.toUpperCase() 
        } results to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }
}



export async function getCookieSecretKey() {
  try {
    const apiEndpoint = `/api/assessment/aws-parameter?parameterName=${
      AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
    }`
    const response = await fetch(apiEndpoint, { method: 'GET' })

    const data = await response.json()


    if (response.status === 200) {
      const SECRET_KEY: string = data.secret
      return SECRET_KEY
    } else {
      throw new Error(
        `Error getting ${AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY}: ${data.error}`
      )
      /**
       * @todo Handle error UI here
       */
    }
  } catch (error: any) {
    throw new Error(
      `Error fetching ${AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY} from API route! ${error}`
    )
    /**
     * @todo Handle error UI here
     */
  }
}




export async function sendEmail(fromEmail: string) {
  // Send email
  try {
    const response = await fetch('/api/assessment/results/SendGrid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: fromEmail }),
    })

    const data = await response.json()

    if (response.status === 200) {
      return data
    } else {
      throw new Error(`Error getting JWT secret: ${data.error}`)
      /**
       * @todo Handle error UI here
       */
    }
  } catch (error: any) {
    throw new Error(`Error! ${error}`)
    /**
     * @todo Handle error UI here
     */
  }
}