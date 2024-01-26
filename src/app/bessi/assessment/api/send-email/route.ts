// Externals
import { ServerClient } from 'postmark'
import { NextRequest, NextResponse } from 'next/server'
import { AWS_PARAMETER_NAMES } from '@/utils'
import { ssmClient } from '@/utils/aws/systems-manager'
import { GetParameterCommandInput, GetParameterCommand } from '@aws-sdk/client-ssm'
// Locals


export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    /**
     * @dev 1. Fetch the API key from AWS Parameter Store
     */
    let serverToken = 'null'

    const input: GetParameterCommandInput = {
      Name: AWS_PARAMETER_NAMES.POSTMARK_API_KEY,
      WithDecryption: true,
    }

    const command = new GetParameterCommand(input)

    try {
      const response = await ssmClient.send(command)

      if (response.Parameter?.Value) {
        serverToken = response.Parameter?.Value
      } else {
        return NextResponse.json(
          { error: `${AWS_PARAMETER_NAMES.POSTMARK_API_KEY} parameter does not exist` },
          { status: 400 }
        )
      }
    } catch (error: any) {
      // Something went wrong
      return NextResponse.json(
        { error: `Error! Something went wrong fetching ${AWS_PARAMETER_NAMES.POSTMARK_API_KEY}: ${error}`, },
        { status: 400, },
      )
    }

    /**
     * @dev 2. Send email using Postmark
     */
    const client = new ServerClient(serverToken)
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
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}