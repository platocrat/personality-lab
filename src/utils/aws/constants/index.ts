// To be used when creating an instance of AWS SDK
export const REGION = 'us-east-1'


// Used for AWS DynamoDB API calls
export const DYNAMODB_TABLE_NAMES = {
  accounts: 'accounts',
  bessi: {
    results: 'bessi--results',
    userResultAccessTokens: 'bessi--user-result-access-tokens',
  },
  genderAndCreativityUs: {
    results: 'gender-and-creativity-us--results',
    userResultAccessTokens: 'gender-and-creativity-us-user--result-access-tokens',
  }
}

export const AWS_PARAMETER_NAMES = {
  JWT_SECRET: 'JWT_SECRET',
  SENDGRID_API_KEY: 'SENDGRID_API_KEY',
  H_CAPTCHA_SECRET_KEY: 'H_CAPTCHA_SECRET_KEY',
  RESULTS_ENCRYPTION_KEY: 'RESULTS_ENCRYPTION_KEY',
  COOKIE_ENCRYPTION_SECRET_KEY: 'COOKIE_ENCRYPTION_SECRET_KEY',
}

export const H_CAPTCHA_SITE_KEY = 'e847d279-4872-4830-a6fc-00faf5c77952'