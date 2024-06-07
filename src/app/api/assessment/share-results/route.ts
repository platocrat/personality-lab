// Externals
import { NextRequest, NextResponse } from 'next/server'
// Locals
import { 
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES, 
  verfiyAccessTokenAndFetchUserResults 
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
    const name = 'id_accessToken_studyId'
    const id_accessToken_studyId = req.nextUrl.searchParams.get(name) ?? ''

    // Split the string by the separator '--'
    const parts = (id_accessToken_studyId as string).split('--')

    if (parts.length !== 3) {
      return NextResponse.json(
        { error: 'Expected exactly 3 parts' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        },
      )
    }

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
        JWT_SECRET
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