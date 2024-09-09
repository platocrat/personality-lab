// Externals
import { sign } from 'jsonwebtoken'
import { NextResponse } from 'next/server'
// Locals
import {
  SSCrypto,
  MAX_AGE,
  COOKIE_NAME,
  StudyAsAdmin,
  ACCOUNT_ADMINS,
  fetchAwsParameter,
  AWS_PARAMETER_NAMES,
  PARTICIPANT__DYNAMODB,
  EncryptedCookieFieldType,
  HASHED_PASSWORD__DYNAMODB,
} from '@/utils'



// ---------------------------------- Types ------------------------------------
type EncryptedItem = { 
  iv: string
  encryptedData: string 
}

export type EncryptedItems = { 
  [key: string]: {
    iv: string
    encryptedData: string
  }
}



// ------------------------------- Functions -----------------------------------
export function hasJWT(
  cookies,
  getJWT?: boolean
) {
  /**
   * @dev 1. Check if a cookie exists for the user
   */
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)

  if (!token) {
    const message = 'Unauthorized: No valid JSON web token was found in the request'

    return NextResponse.json(
      { message },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } else {
    if (getJWT) {
      const JWT = token.value
      return JWT
    } else {
      return
    }
  }
}



export function getEncryptedItems(
  toEncrypt: { [key: string]: string }[],
  secretKeyCipher: Buffer
): EncryptedItems {
  let encryptedItems: EncryptedItems = {}

  toEncrypt.forEach((item: { [key: string]: string }, i: number): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const encryptedItem = new SSCrypto().encrypt(
      value,
      secretKeyCipher
    )

    encryptedItems[key] = encryptedItem
  })

  return encryptedItems
}



export function getDecryptedItems(
  toDecrypt: { [key: string]: EncryptedCookieFieldType }[],
  secretKeyCipher: Buffer
): { [key: string]: string } {
  let decryptedItems: { [key: string]: string } = {}

  toDecrypt.forEach((
    item: { [key: string]: EncryptedCookieFieldType }, 
    i: number
  ): void => {
    const key = Object.keys(item)[0]
    const value = Object.values(item)[0]

    const decryptedItem = new SSCrypto().decrypt(
      value.encryptedData,
      secretKeyCipher,
      value.iv,
    )

    decryptedItems[key] = decryptedItem
  })

  return decryptedItems
}



/**
 * @param cookies Imported from `next/header`
 */
export function setJwtCookieAndGetCookieValue(
  cookies,
  encryptedItems: EncryptedItems,
  passwordHash: string,
  JWT_SECRET: string,
) {
  /**
   * @dev 1. Sign the JWT 
   * @notice Make sure the password that is stored in the cookie is hashed!
   */
  const token = sign(
    {
      ...encryptedItems,
      password: passwordHash,
    },
    JWT_SECRET as string,
    { expiresIn: MAX_AGE.SESSION }
  )

  // 2. Delete previous cookie
  cookies().delete(COOKIE_NAME)

  // 3. Store the cookie
  cookies().set(COOKIE_NAME, token, {
    /**
     * @dev A cookie with the `HttpOnly` attribute can't be modified by 
     * JavaScript, for example using `Document.cookie`; it can only be
     * modified when it reaches the server. Cookies that persist user 
     * sessions for example should have the `HttpOnly` attribute set — 
     * it would be really insecure to make them available to JavaScript. 
     * This precaution helps mitigate cross-site scripting (`XSS`) 
     * attacks.
     * 
     * See Mozilla docs for more info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
     */
    httpOnly: true,
    /**
     * @todo Change to `true` to ensure cookie is only sent to 
     * the server with an encrypted request over the HTTPS 
     * protocol (except on localhost), which means MITM attackers
     * can't access it easily. Insecure sites (with `http`: in 
     * the URL) can't set cookies with the `Secure` attribute. 
     * However, don't assume that `Secure` prevents all access to
     * sensitive information in cookies. For example, someone with
     * access to the client's hard disk (or JavaScript if the 
     * `HttpOnly` attribute isn't set) can read and modify the
     * information.
     * 
     * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#block_access_to_your_cookies
     */
    secure: true,
    sameSite: 'strict',
    path: '/',
  })

  // 4. Get the cookie value from the cookie name
  const cookieValue: string = cookies().get(COOKIE_NAME)?.value ?? 'null'
  return cookieValue
}



/**
 * @param cookies Imported from `next/header`
 */
export async function verifiedEmailAndPasswordSwitch(
  switchCondition: string,
  cookies,
  email: string,
  // username: string,
  storedParticipant: PARTICIPANT__DYNAMODB | undefined,
  storedStudiesAsAdmin: StudyAsAdmin[] | [],
  storedPassword: HASHED_PASSWORD__DYNAMODB,
): Promise<NextResponse<{ error: string }> | NextResponse<{ message: string }>> {
  switch (switchCondition) {
    // Code for when both email and password are verified
    case 'true-true':
      const JWT_SECRET = await fetchAwsParameter(
        AWS_PARAMETER_NAMES.JWT_SECRET
      )

      if (typeof JWT_SECRET === 'string') {
        const SECRET_KEY = await fetchAwsParameter(
          AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        )


        if (typeof SECRET_KEY === 'string') {
          const secretKeyCipher = Buffer.from(SECRET_KEY, 'hex')

          // Determine if the new user is an admin
          const isGlobalAdmin = ACCOUNT_ADMINS.some(
            admin => admin.email === email
          )
          // Determine if the new user is a participant
          const isParticipant = storedParticipant?.id !== undefined
            ? true
            : false

          const timestamp = Date.now().toString()

          const toEncrypt: { [key: string]: string }[] = [
            { email: email as string },
            // { username: username as string },
            { studiesAsAdmin: JSON.stringify(storedStudiesAsAdmin) },
            { isGlobalAdmin: isGlobalAdmin.toString() },
            { isParticipant: isParticipant.toString() },
            { timestamp: timestamp },
          ]

          const encryptedItems = getEncryptedItems(
            toEncrypt,
            secretKeyCipher
          )

          const cookieValue = setJwtCookieAndGetCookieValue(
            cookies,
            encryptedItems,
            storedPassword.hash,
            JWT_SECRET,
          )

          const message = 'Verified email and password'

          /**
           * @dev 5. Return response
           */
          return NextResponse.json(
            {
              message,
              isGlobalAdmin,
              isParticipant,
            },
            {
              status: 200,
              headers: {
                'Set-Cookie': cookieValue,
                'Content-Type': 'application/json'
              }
            },
          )
        } else {
          return SECRET_KEY as NextResponse<{ error: string }>
        }
      } else {
        return JWT_SECRET as NextResponse<{ error: string }>
      }

      break

    // Code for when only email is verified
    case 'true-false':
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 200 },
      )
      break

    // Code for when only password is verified
    case 'false-true':
      return NextResponse.json(
        { message: 'Incorrect email' },
        { status: 200 },
      )
      break

    // Code for when neither is verified
    default:
      return NextResponse.json(
        { message: 'Incorrect email and password' },
        { status: 200 },
      )
      break
  }
}