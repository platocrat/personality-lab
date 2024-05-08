// To be used when creating an instance of AWS SDK
export const REGION = 'us-east-1'
const _credentials = {
  aws_access_key_id: `ASIA4ID7IBTSGJ33HEQ4`,
  aws_secret_access_key: `+vO2E84hvrx7KxZ1UkjIF7ZafDWGk8fFc1lzrQXW`,
  aws_session_token: `IQoJb3JpZ2luX2VjEIf//////////wEaCXVzLWVhc3QtMSJIMEYCIQDiuwr5G9shWALkE07HbCuNkZyKwu/LrFpw3Tcp9upfCAIhAIO2k9MtxV29J5GMnpXpaEzXhmWFfGX/E1lckrD84xBQKvACCOD//////////wEQABoMODQyMDgwNDU1OTA4Igwa23R4xH4SFOzM1nIqxAKRPZn7tr8KQbbjPLvMyE/U6SVwTAQ20Mk89xNB72VUvG3PTBz3Rh6ixLJU1+bgl9LHHBwxHnVAwxQKNwrh2hA/v0jOnyYT1NfIeF+Vd18FyM36L4GjvhBzrSElaiFu/RYTeudSmT0X9TiaXnULJtQfwznZToHVTfYUokZeqLcBbPNjnHn2ww/CfJ1UtWdX6Ov5j63XFsSRFxuW1B06NcxH/VItx3AJvCouGEdHHZ5WsiHuHitVqwpILZubDdqUJ9+280Qbs5wwkRQUQzZ9sckVLGLYmWHzPq38nkhn7NZk3o8EjYdCbwWNx2rV56iUjtDSLM3hi/mtzLV0gPfR5y6Mrk1LKeUvhrNzp85iLE/ElduXF3GVtaFZ7Bnpp5C6axxx+2TNu+iFEkEWtYm5mjtxHH3oGa01CItUkTYZpBjNT/mpGGoww9zqsQY6pgFhNZoevTs2VRRWyj0Ix25ZYMzuxWbJpcrXfCuGeS+fNvJkQqZckC6so6U9RDA7SNHHo28pi//UhrhLvqb9YF+ui5hOM4W1N+oWkJ9I/U2svFRqBkVCROF3I5ZoxEmDWw5YJyVkdUmDI5ycEm8CabiBE/CnUmyUqDoiVe3v4VeBfsPy44Vb0ZAC3VGCEFGMhWoQYVqaS5QBpdBw/eN5tm+KKJn9XxPs`,
}
export const CREDENTIALS = {
  accessKeyId: _credentials.aws_access_key_id,
  secretAccessKey: _credentials.aws_secret_access_key,
  sessionToken: _credentials.aws_session_token
}


// Used for AWS DynamoDB API calls
export const DYNAMODB_TABLE_NAMES = {
  BESSI_ACCOUNTS: 'BESSI-accounts',
  BESSI_RESULTS: 'BESSI-results',
  BESSI_USER_RESULT_ACCESS_TOKENS: 'BESSI-user-result-access-tokens',
}
export const AWS_PARAMETER_NAMES = {
  JWT_SECRET: 'JWT_SECRET',
  SENDGRID_API_KEY: 'SENDGRID_API_KEY',
  H_CAPTCHA_SECRET_KEY: 'H_CAPTCHA_SECRET_KEY',
  RESULTS_ENCRYPTION_KEY: 'RESULTS_ENCRYPTION_KEY',
  COOKIE_ENCRYPTION_SECRET_KEY: 'COOKIE_ENCRYPTION_SECRET_KEY',
}
export const H_CAPTCHA_SITE_KEY = 'e847d279-4872-4830-a6fc-00faf5c77952'