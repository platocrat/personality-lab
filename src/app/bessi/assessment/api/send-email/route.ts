// Externals
import { ServerClient } from 'postmark'
import { NextRequest, NextResponse } from 'next/server'
import { GetParameterCommandInput, GetParameterCommand } from '@aws-sdk/client-ssm'
// Locals
import { AWS_PARAMETER_NAMES } from '@/utils'
import { fetchAwsParameter, ssmClient } from '@/utils/aws/systems-manager'



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    const SERVER_TOKEN = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.POSTMARK_API_KEY
    )

    if (typeof SERVER_TOKEN === 'string') {
      /**
       * @dev 2. Send email using Postmark
       */
      const client = new ServerClient(SERVER_TOKEN)
      const postmarkEmail = {
        From: "jlmaldo2@illinois.edu",
        To: "jlmaldo2@illinois.edu",
        Subject: "Hello from Postmark",
        HtmlBody: "<strong>Hello</strong> dear Postmark user.",
        TextBody: "Hello from Postmark!",
        MessageStream: "outbound"
      }

      try {
        /**
         * @todo Need a proper `From` email address
         */
        const response = await client.sendEmail(postmarkEmail)

        console.log(`response: `, response)

      } catch (error: any) {
        // Something went wrong
        return NextResponse.json(
          { error: error },
          { status: 500 }
        )
      }
    } else {
      return SERVER_TOKEN as NextResponse<{ error: string }>
    }    
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}