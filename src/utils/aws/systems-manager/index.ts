// Externals
import { 
  SSMClient,
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { NextResponse } from 'next/server'
// Locals
import { 
  REGION,
  // CREDENTIALS,
  AWS_PARAMETER_NAMES, 
} from '..'



export const ssmClient = new SSMClient({ region: REGION })
// export const ssmClient = new SSMClient({ 
//   region: REGION,
//   credentials: CREDENTIALS
// })

/**
 * @dev Fetches the requested parameter from AWS Parameter Store.
 * @notice Assumes that the parameter is encrypted.
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