// Externals
import { decode } from 'jsonwebtoken'
// Locals
import LibsodiumUtils from '@/utils/libsodium'
import { AWS_PARAMETER_NAMES } from '@/utils/aws'
// Types
import { CookieType } from '../types'




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
        method: 'POST',
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
    const response = await fetch('/api/assessment/aws-parameter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameterName: AWS_PARAMETER_NAMES.JWT_SECRET
      }),
    })

    const data = await response.json()


    if (response.status === 200) {
      const JWT_SECRET: string = data.secret
      const cookies = document.cookie
      const token = cookies.split('=')[0]

      // Cannot use `verify()` because it is only used server-side
      const decoded = decode(token)
      const encryptedEmail = (decoded as CookieType).email
      const encryptedUsername = (decoded as CookieType).username

      const SECRET_KEY = await getCookieSecretKey()

      const email = await LibsodiumUtils.decryptData(encryptedEmail, SECRET_KEY)
      const username = await LibsodiumUtils.decryptData(encryptedUsername, SECRET_KEY)

      return { email, username }
    } else {
      throw new Error(
        `Error getting ${AWS_PARAMETER_NAMES.JWT_SECRET}: ${data.error}`
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
    const response = await fetch('/api/assessment/aws-parameter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameterName: AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
      }),
    })

    const data = await response.json()


    if (response.status === 200) {
      const SECRET_KEY: string = data.secret
      return LibsodiumUtils.base64ToUint8Array(SECRET_KEY)
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




export async function sendEmail() {
  const { email } = await getUsernameAndEmailFromCookie()


  if (email === undefined) {
    /**
     * @todo Replace the line below by handling the error UI here
     */
    throw new Error(`Error getting email from cookie!`)
  } else {
    // Send email
    try {
      const response = await fetch('/api/assessment/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.status === 200) {
        console.log(`data: `, data)
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
}