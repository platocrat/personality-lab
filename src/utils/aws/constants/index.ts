// To be used when creating an instance of AWS SDK
export const REGION = 'us-east-1'

const credentials_ = {
  aws_access_key_id: `ASIA4ID7IBTSFZSUKVRS`,
  aws_secret_access_key: `zX9LpqSyTyAnShUyP2tIP2bZ/meUB/Z3t2lumyBg`,
  aws_session_token: `IQoJb3JpZ2luX2VjEIT//////////wEaCXVzLWVhc3QtMSJGMEQCIHh4y+ytdiXPdEZvTuDNbieJrBev/Auc4VqKkM1TeV/VAiALEyTm1gB60exgrPlmKUaVg/3TzZCK9sXZmcf+u1j4byrnAggdEAAaDDg0MjA4MDQ1NTkwOCIMRMypdRzpJpxSEoqUKsQCzvSK/VVu8ukRMwoej8+Zu2XFvIVZY+uZNjK+POgxLDBeCDiX5tK03s2iKE2dhTIDuQaRQiyzp1v4KAC3b6e6owVF0c8hjeJTBBAP19hfYa8U9PxWwk4UJG1u/boYWYFOCka75rB8CGbgL2MCZPNgZLkuFvueQ/3tHo1yEPW3qLVH/BnKO6wxlatMdF9jDb+l7JTVUNNSo2wJToyfG+qTrkTmlsB58Csk7/SDei/Q+h64B62uGPUVsHHmm+d3NK2AOxFs5qVigfaE8+btYE4IPSM4OYzg+8SYG9zsKMiAlgzYCrq3XIiyVGl3rDElGV0LsztTMEuAaYVi40dfwST2hbx/J/UD+a2ZmGyc0gKQgE97wluv0A7znT08q1QX3UTig2HW4uYkZF/JAFFXzmzqJSdtrd0AGPXiXe7NC8cf7zQDOYDyMKPxkrMGOqgBGuCENP0GhVOjXjzqz1uqAinHUVyFu4NxiK1XdRAxj33dWT2VX20Ov1yJCXu9Fv7m9Q/9JnHGkmq6ch1mMS3yaMxyiGZixaqJjX0r3AhbM+WhM3CG4xdQj8XoDFRzXXCv77meIT4B4ZGYUZ6gsvH+98NiWCD5OdIITTZBg1qf3S0WVbI8Lneua8cG8kkqNB4y8qy8Z+1xEH6bJsIGSn8PcgYeNVUKr/9i`,
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