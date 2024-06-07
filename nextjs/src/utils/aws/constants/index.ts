// To be used when creating an instance of AWS SDK
export const REGION = 'us-east-1'

const credentials_ = {
  aws_access_key_id: `ASIA4ID7IBTSJYSG6J4T`,
  aws_secret_access_key: `e+5y/mMn8aDPrqhtP6A41S8ZCAw++/9dh66dbDoW`,
  aws_session_token: `IQoJb3JpZ2luX2VjEFoaCXVzLWVhc3QtMSJHMEUCIQC/XPI+QQo2KNWzIBxZkt1BrlpixfEaOh+ceb86Q2F5mQIgEfAjpMWe7llMeZb9kjEKeaynlgLHtcTpgWshWoMN0fcq8AII4///////////ARAAGgw4NDIwODA0NTU5MDgiDAgqvJ/e4dNPw+v1XCrEAo+61X6r2o558bpUe8PCIyzAYD6v6Y9gC4C4nFZ8XF7ezod0LfxLznpg59ys68t9ZnRQZasshmaIl4RoNeZefCIZ58YrwjlEJ9VKnpve95VqpVpFbnsAzGDvMw9FNyE6Ho1Q8ess39aJfUVgrj0L9ITXeCCROfk8q89iywuGCP+9m9ee09K4LCR81Hn/laF54q+Afi/GxvSLU65mVf4Tklvt8lk1ERVZHdpkJoKAOpywsivq8CzwJGSNbTXig1Zru1cjzan030wS7qBDcJdY39GbcZYR2niMhPeXazI05OpFqCDZA5bxxALgM7OOKinul2nOBWsoOVAnwnkthETp/NlnYBFgf31Aq3PXCfTZgK/ZFsaMX6IZc7JtmdKCM2HNcukTUraDRuG3Gq0bY2Nz1vHme3hWg2D5kT6gmhDFlItDMmIoJjD/x4mzBjqnAVU9YFnQpfZ1s0/CDy2XX+bQ0a3bb2ON9tWJz0PfiWxVUt6idjefprOJsnSji7e8J3cz6xMy+rdL0hyR2XQS3h3A74alXZhFNaHvzGp/X7pDxtJMj7AbYAnnFv3exggDh7Tq3F54JEj9AQiA7dbvoEtjn/CU9q4PT6OJoTLH4qzX6e5Z7J7uyOTN7lVY74xuPxw+OAsNEUAB0yYLFOdiGrLQKL5rPC2L`,
}

export const CREDENTIALS = {
  accessKeyId: credentials_.aws_access_key_id,
  secretAccessKey: credentials_.aws_secret_access_key,
  sessionToken: credentials_.aws_session_token,
}



// Used for AWS DynamoDB API calls
export const DYNAMODB_TABLE_NAMES = {
  studies: 'studies',
  accounts: 'accounts',
  vizRating: 'viz-ratings',
  userResultsAccessTokens: 'user-results-access-tokens',
}

export const AWS_PARAMETER_NAMES = {
  JWT_SECRET: 'JWT_SECRET',
  SENDGRID_API_KEY: 'SENDGRID_API_KEY',
  H_CAPTCHA_SECRET_KEY: 'H_CAPTCHA_SECRET_KEY',
  COOKIE_ENCRYPTION_SECRET_KEY: 'COOKIE_ENCRYPTION_SECRET_KEY',
  RESULTS_ENCRYPTION_SECRET_KEY: 'RESULTS_ENCRYPTION_SECRET_KEY',
  SHARE_RESULTS_ENCRYPTION_SECRET_KEY: 'SHARE_RESULTS_ENCRYPTION_SECRET_KEY',
}

export const H_CAPTCHA_SITE_KEY = 'e847d279-4872-4830-a6fc-00faf5c77952'