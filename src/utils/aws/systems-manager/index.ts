// Externals
import { 
  SSMClient,
  GetParameterCommand, 
  GetParameterCommandInput, 
} from '@aws-sdk/client-ssm'
import { NextResponse } from 'next/server'
// Locals
import { AWS_PARAMETER_NAMES, REGION } from '..'



// export const ssmClient = new SSMClient({ region: REGION })
export const ssmClient = new SSMClient({ 
  region: REGION,
  credentials: {
    accessKeyId: 'ASIA4ID7IBTSOFYJZV4A',
    secretAccessKey: 'mTevInQ0ry/5KoC/BjZNOVBEDFNDK4cnw85uv+pD',
    sessionToken: 'IQoJb3JpZ2luX2VjEJ7//////////wEaCXVzLWVhc3QtMSJIMEYCIQDnB0pdJ2qh71bc+NwNyW02VaPdS79dJzVXqrkGXiMH4wIhAPGde+JyP60Jgb2fbODLCIAyNcCtBbKGRWEKSytEVJ7SKvACCJf//////////wEQABoMODQyMDgwNDU1OTA4IgxEqHkmH3JJ+pzSbscqxAK8gbyssyRM+7hzPqz1dPAwf+3hUyxdmN2ZVZS78jM1ZyXluq8p0wuGT3wg0NB8E7HtwZQXMeqG9KdrhKnb0G6KbeXU7W0M4ZO8Vf6/utAN0wUql/LLNaKgATjI7yRh3MMpebFnGJkrejZcQO+5JHxE9BP/lNMfD1SxCUTRP7a17GZmjGCMmLpgjI9WRq++X8ic+MQcMaxiiKp5cBNIipxyV8dzvaK6s/V9mfoQ3S7/OSGdFJhJWxQYlHWSTuWyPWXlfhrWtyFQ08jt3KinR0aL2m7g8nODDbOH9Y6nDKEzM5QqYVZHaJWx4qedg/w397wEhUUF44akKLYSRLVvlFKrA5KgltmjIRdGZJ16BgOoy6U3rWxWMvJwrBJXiGUXQyjsq3S+YOj0tEyd63N5jgPOYvSrrqxVydi0oovSfOeTe/vEgLkwm6eerwY6pgFmvkSFPPlJzxtO3Q3P5s+7HrawDqiyzzZX5Jer/LcO7JftF2OgMwk5RzLq1rIwbG1zAr0xdyeoVMBc/4ij7K65AbIJbbXRjyRA8XvzoeFYpCbtRjPEHl+7rajjZfll359qupEZJrk30FczvaD0oGkI/OiYHpNR/iGmR8t2/27zueyoqbEKGf0ZSQFYa4vP+7CnrO8e6pnm2HCrljeeBgrdVw9FKpcr'
  }
})


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