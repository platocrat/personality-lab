// Externals
import { 
  SSMClient,
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'

// Locals
import { AWS_PARAMETER_NAMES, REGION } from '..'
import { NextResponse } from 'next/server'



export const ssmClient = new SSMClient({ region: REGION })


/**
 * @dev Fetches the requested parameter from AWS Parameter Store.
 */
export async function fetchAwsParameter(
  parameterName: string
): Promise<string | NextResponse<{ error: string }>> {
  let parameter = 'null'

  const input: GetParameterCommandInput = {
    Name: parameterName,
    WithDecryption: true,
  }

  const command = new GetParameterCommand(input)

  try {
    const response = await ssmClient.send(command)

    if (response.Parameter?.Value) {
      return parameter = response.Parameter?.Value
    } else {
      return NextResponse.json(
        { error: `${ parameterName } parameter does not exist` },
        { status: 400 }
      )
    }
  } catch (error: any) {
    // Something went wrong
    return NextResponse.json(
      { error: `Error! Something went wrong fetching ${ parameterName }: ${error}`, },
      { status: 400, },
    )
  }
}