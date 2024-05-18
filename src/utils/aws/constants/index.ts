import { BIG_FIVE_PATH } from '@/utils/assessments'


// To be used when creating an instance of AWS SDK
export const REGION = 'us-east-1'

const _credentials = {
  aws_access_key_id: `ASIA4ID7IBTSI4CRER7X`,
  aws_secret_access_key: `IwzqDHI3J8UyFPZwvDa3svSICRA68CCqNOYylxmi`,
  aws_session_token: `IQoJb3JpZ2luX2VjEIj//////////wEaCXVzLWVhc3QtMSJIMEYCIQCOk+6EUhjwvzCbl09LWLV7rVnsIYeFdSTeq3CQ15Hw5gIhALYTCNZlw8YS8Pz9vWK/+52EaDZ6MJygsdgADkX+yBFTKvACCPH//////////wEQABoMODQyMDgwNDU1OTA4Igz/dgaaRV7rOb7LLTcqxALM7HyVl4SEYdOz7Ep2YFhFwS6F0zjJdQJYtiBsIOeJwBD6zS1B8jcbaKLHOtNQORYu34y3HxAKeExWrxSxHyeJjj84EI3zJlmdeAaDKLPwhBYSjh4WDzy3YZUWZjxDyOn+TtNneSWjRsUVxkY1hmPih55NGSbh6j4aP8a3Lm1ugBoCb0ZTaWJ5ChT/W1ts01o8SiSec/6295b1ws23cBfCOCGGe1UZhuBdYaDw3yJkeXHR8nTRpUUTZ1yQSD523b/HGH4pI46oe58dmWZqUN44+rWqWm1Bbsq5zyc+LaLNicJG27ym+FZQe3yhFwlgUDm6l56kujOnKpu0X5HaX4FDXfvJWIstvjXQqvV6W1YWy6enCWKCZVwV5EGN+q/gFaaUH8zgc2I38XziP9vu7YKpcGwmekWCqKveidDPrPMS5rYcVRYw0pGjsgY6pgG6n3c5z80S+AVoGem6OfY9FPhAUQQM9giK93GE+o/6giswL+GdYJ1MT6g2XgzSSBz4RWGzQUT13hB+oQOPBm/U9eKyLalV/tGqrFsOd+JpRi43dtP/D9/oLIhap5V73RUlcrL0lpd0hF9OTyM+iPcZNpZF4XtdmotLPxr/TLJdbjNZlUZK04+Z/eq8yblJHYlYMNH0BfAfXvUt3UGrqHLo8XT7VIzI`,
}

export const CREDENTIALS = {
  accessKeyId: _credentials.aws_access_key_id,
  secretAccessKey: _credentials.aws_secret_access_key,
  sessionToken: _credentials.aws_session_token
}


// Used for AWS DynamoDB API calls
export const DYNAMODB_TABLE_NAMES = {
  results: 'results',
  accounts: 'accounts',
  vizRating: 'viz-ratings',
  userResultsAccessTokens: 'user-results-access-tokens',
}

export const AWS_PARAMETER_NAMES = {
  JWT_SECRET: 'JWT_SECRET',
  SENDGRID_API_KEY: 'SENDGRID_API_KEY',
  H_CAPTCHA_SECRET_KEY: 'H_CAPTCHA_SECRET_KEY',
  RESULTS_ENCRYPTION_KEY: 'RESULTS_ENCRYPTION_KEY',
  COOKIE_ENCRYPTION_SECRET_KEY: 'COOKIE_ENCRYPTION_SECRET_KEY',
}

export const H_CAPTCHA_SITE_KEY = 'e847d279-4872-4830-a6fc-00faf5c77952'