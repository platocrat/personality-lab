// Externals
import sgMail from '@sendgrid/mail'
import { NextRequest, NextResponse } from 'next/server'
import { GetParameterCommandInput, GetParameterCommand } from '@aws-sdk/client-ssm'
// Locals
import { 
  ssmClient,
  fetchAwsParameter, 
  AWS_PARAMETER_NAMES,
} from '@/utils'



export async function POST(
  req: NextRequest,
  res: NextResponse,
) {
  if (req.method === 'POST') {
    const { email } = await req.json()

    const API_KEY = await fetchAwsParameter(
      AWS_PARAMETER_NAMES.SENDGRID_API_KEY
    )


    if (typeof API_KEY === 'string') {
      sgMail.setApiKey(API_KEY)

      /**
       * @todo Need to finalize:
       * 1. `From` email address
       * 2. Subject
       * 3. Text
       * 4. HTML
       */
      const msg = {
        to: email,
        from: 'bwroberts@illinois.edu', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }

      try {
        const response = await sgMail.send(msg)

        console.log(`response: `, response)

        if (response[0].statusCode === 200) {
          return NextResponse.json(
            { message: `Email has been send to ${ email }` },
            { status: 200 }
          )
        } else {
          // Something went wrong sending the email with SendGrid.
          return NextResponse.json(
            { error: `There was an error after sending the email.` },
            { status: 500 }
          )
        }
      } catch (error: any) {
        // Something went wrong
        return NextResponse.json(
          { error: error },
          { status: 500 }
        )
      }
    } else {
      return API_KEY as NextResponse<{ error: string }>
    }    
  } else {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 },
    )
  }
}