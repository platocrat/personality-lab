// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  CSCrypto,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES, 
  verfiyAccessTokenAndFetchUserResults, 
} from '@/utils'



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
    const name = 'eeShareableId'
    const eeShareableId = req.nextUrl.searchParams.get(name) ?? ''

    const decryptedDhareableId = await CSCrypto.decodeAndDecrypt(eeShareableId)

    // Split the string by the separator '--'
    const parts = (decryptedDhareableId as string).split('--')

    const id = parts[0]
    const accessToken = parts[1]
    // const studyId = parts[2]

    // 1. Fetch JWT secret to verify if the user is authorized to access the 
    //    `userResults` mapped to the provided `id`.
    const JWT_SECRET = await fetchAwsParameter(AWS_PARAMETER_NAMES.JWT_SECRET)


    if (typeof JWT_SECRET === 'string') {
      // 2. Verify `accessToken` using the JWT secret
      return await verfiyAccessTokenAndFetchUserResults(
        id,
        accessToken,
        JWT_SECRET,
        req,
      )
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