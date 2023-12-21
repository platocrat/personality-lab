import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts'

type TemporaryCredentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
}

export const REGION = 'us-east-1'
const CREDENTIALS = {
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY
}

const stsClient = new STSClient({
  region: REGION,
  credentials: CREDENTIALS,
})

/**
 * @dev Used to request temporary credentials to use to instantiate an AWS 
 *      Service Client. 
 */
export async function getTemporaryCredentials(
  hours: number,
  roleSessionName: string,
): Promise<TemporaryCredentials> {
  const SECONDS_PER_MINUTE = 60
  const MINUTES_PER_HOUR = 60
  const DURATION_SECONDS = SECONDS_PER_MINUTE * MINUTES_PER_HOUR * hours

  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: process.env.NEXT_AWS_ROLE_ARN,
    RoleSessionName: roleSessionName,
    DurationSeconds: DURATION_SECONDS
  })

  try {
    const response = await stsClient.send(assumeRoleCommand)

    const temporaryCredentials = {
      accessKeyId: response.Credentials?.AccessKeyId ?? 'null',
      secretAccessKey: response.Credentials?.SecretAccessKey ?? 'null',
      sessionToken: response.Credentials?.SessionToken ?? 'null',
    }

    return temporaryCredentials
  } catch (error) {
    console.error('Error assuming role: ', error)
    throw error
  }
}