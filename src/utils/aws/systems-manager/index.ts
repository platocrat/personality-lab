// Externals
import { SSMClient } from '@aws-sdk/client-ssm'

// Locals
import { REGION } from '..'

export const ssmClient = new SSMClient({ region: REGION })