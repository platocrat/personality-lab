// Externals
import { decode } from 'jsonwebtoken'
// Locals
import { 
  CookieType,
  AWS_PARAMETER_NAMES,
  SSCrypto,
} from '@/utils'




export async function getAccessToken(
  assessmentName: string,
  userResultsId: string
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
        body: JSON.stringify({ assessmentName, userResultsId }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const accessToken = json.data
        return accessToken
      } else {
        const error = `Error posting ${ 
          assessmentName.toUpperCase() 
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




/**
  * @dev Note that the password that is returned is a hashed password
  */
export async function getUsernameAndEmailFromCookie() {
  try {
    const apiEndpoint = `/api/assessment/aws-parameter?parameterName=${
      AWS_PARAMETER_NAMES.JWT_SECRET
    }`
    const response = await fetch(apiEndpoint, { method: 'GET' })

    const json = await response.json()


    if (response.status === 200) {
      const JWT_SECRET: string = json.secret
      const cookies = document.cookie
      const token = cookies.split('=')[0]

      // Cannot use `verify()` because it is only used server-side
      const decoded = decode(token)
      const encryptedEmail = (decoded as CookieType).email
      const encryptedUsername = (decoded as CookieType).username

      const SECRET_KEY = await getCookieSecretKey()
      const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')

      const email = new SSCrypto().decrypt(
        encryptedEmail.encryptedData, 
        secretKeyCipher,
        encryptedEmail.iv
      )
      const username = new SSCrypto().decrypt(
        encryptedUsername.encryptedData, 
        secretKeyCipher,
        encryptedUsername.iv
      )

      return { email, username }
    } else {
      throw new Error(
        `Error getting ${AWS_PARAMETER_NAMES.JWT_SECRET}: ${json.error}`
      )
      /**
       * @todo Handle error UI here
       */
    }
  } catch (error: any) {
    throw new Error(
      `Error fetching ${AWS_PARAMETER_NAMES.JWT_SECRET} from API route! ${error}`
    )
    /**
     * @todo Handle error UI here
     */
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