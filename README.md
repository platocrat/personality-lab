# personality-lab

[Next.js](https://nextjs.org) application for [Dr. Brent Roberts](https://psychology.illinois.edu/directory/profile/bwrobrts), a Professor of Psychology at the University of Illinois at Urbana-Champaign, and his research labs.

> "[Brent W. Roberts](https://psychology.illinois.edu/directory/profile/bwrobrts) is a Professor of Psychology and at the University of Illinois at Urbana-Champaign, he holds the Gutsgell Endowed Professorship at the University of Illinois, is designated as a Health Innovation Professor in the Carle-Illinois College of Medicine, and is a Distinguished Guest Professor at the Hector Research Institute of Education Sciences and Psychology at the University of Tübingen, Germany."
>
> — University of Illinois at Urbana-Champaign

## Table of Contents

- [0. General Information](#0-general-information)
  - [0.1 Project Goals](#01-project-goals)
    - [0.1.1 Reference Models](#011-reference-models)
      - [0.1.1.1. yourPersonality.net](#0111-yourpersonalitynet)
      - [0.1.1.2. what-is-my-personality.com](#0112-what-is-my-personalitycom)
      - [0.1.1.3. The Social-Emotional-Behavioral (SEB) Skills Lab](#0113-the-social-emotional-behavioral-seb-skills-lab)
      - [0.1.1.4. Qualtrics](#0114-qualtrics)
      - [0.1.1.5. Prolific](#0115-prolific)
      - [0.1.1.6. Linkedin](#0116-linkedin)
      - [0.1.1.7. Kahoot](#0117-kahoot)
      - [0.1.1.8 Inclivio](#0118-inclivio)
      - [0.1.1.9 In8ness](#0119-in8ness)
  - [0.2. Project Structure](#02-project-structure)
- [1. Local development](#1-local-development)
- [2. Launch a new AWS EC2 instance on the AWS console](#2-launch-a-new-aws-ec2-instance-on-the-aws-console)
  - [2.1. Application and OS Images](#21-application-and-os-images)
  - [2.2 Instance Type](#22-instance-type)
  - [2.3. Key pair (login)](#23-key-pair-login)
  - [2.4. Network Settings](#24-network-settings)
- [3. Attach an IAM Role to a newly created EC2 instance](#3-attach-an-iam-role-to-a-newly-created-ec2-instance)
- [4. Deploying the Next.js app to AWS EC2 instance and serving it with Caddy](#4-deploying-the-nextjs-app-to-aws-ec2-instance-and-serving-it-with-caddy)
  - [4.1. Set up a Caddy server](#41-set-up-a-caddy-server)
    - [4.1.1. SSH in to EC2 instance](#411-ssh-in-to-ec2-instance)
    - [4.1.2. Install `caddy` from source](#412-install-caddy-from-source)
  - [4.2. Working with Caddy server](#42-working-with-caddy-server)
    - [4.2.1 Working with multiple domains in a single Caddyfile](#421-working-with-multiple-domains-in-a-single-caddyfile)
    - [4.2.2 Adding the WebSocket server to the Caddyfile](#422-adding-the-websocket-server-to-the-caddyfile)
    - [4.2.3 Upgrade `caddy`](#423-upgrade-caddy)
    - [4.2.4 Locate Caddy's TLS certificate and private key](#424-locate-caddys-tls-certificate-and-private-key)
  - [4.3. On EC2 instance, install Docker, login, and start the Docker daemon](#43-on-ec2-instance-install-docker-login-and-start-the-docker-daemon)
    - [4.3.1. Install `docker`](#431-install-docker)
    - [4.3.2. Run `docker` commands without `sudo`](#432-run-docker-commands-without-sudo)
    - [4.3.3. Login to Docker](#433-login-to-docker)
    - [4.3.4. Start the Docker daemon](#434-start-the-docker-daemon)
    - [4.3.5. Prune all data from Docker](#435-prune-all-data-from-docker)
  - [4.4. Push new commits to GitHub to see the GitHub Action automate the deployment process](#44-push-new-commits-to-github-to-see-the-github-action-automate-the-deployment-process)
  - [4.5. Manually start the Next.js app by running the image](#45-manually-start-the-nextjs-app-by-running-the-image)
    - [4.5.1. Make sure the Docker daemon is running](#451-make-sure-the-docker-daemon-is-running)
    - [4.5.2. Run the image of the Next.js app in detached mode](#452-run-the-image-of-the-nextjs-app-in-detached-mode)
    - [4.5.3. Start the Caddy server](#453-start-the-caddy-server)
- [5. What to do if the SSH key ever gets lost, deleted, or corrupted](#5-what-to-do-if-the-ssh-key-ever-gets-lost-deleted-or-corrupted)
  - [5.1. Stop and delete the EC2 instance and launch a new one](#51-stop-and-delete-the-ec2-instance-and-launch-a-new-one)
  - [5.2. In the menu to launch a new EC2 instance, create a new SSH key pair](#52-in-the-menu-to-launch-a-new-ec2-instance-create-a-new-ssh-key-pair)
  - [5.3. Follow the instructions on the `Connect` page to SSH into the new EC2 instance](#53-follow-the-instructions-on-the-connect-page-to-ssh-into-the-new-ec2-instance)
- [6. What to do if you want to use a new Elastic IP address?](#6-what-to-do-if-you-want-to-use-a-new-elastic-ip-address)
- [7. Working with `screen` to view Next.js and Caddy logs separately](#7-working-with-screen-to-view-nextjs-and-caddy-logs-separately)
  - [7.1 Example workflow with `screen`](#71-example-workflow-with-screen)
- [8. Auth0](#8-auth0)
  - [8.1 Set up a Database Connection for DynamoDB](#81-set-up-a-database-connection-for-dynamodb)
    - [8.1.1 Specify DynamoDB table for IAM User](#811-specify-dynamodb-table-for-iam-user)
    - [8.1.2 Database Action Scripts](#812-database-action-scripts)
  - [8.2 Application URIs](#82-application-uris)
  - [8.3 Debugging `Callback URL Mismatch.` error](#83-debugging-callback-url-mismatch-error)
- [9. Working with Docker containers](#9-working-with-docker-containers)
  - [9.1 Enter a Docker container's shell](#91-enter-a-docker-containers-shell)
  - [9.2 Prune all data from Docker](#92-prune-all-data-from-docker)
- [10. Configure IAM role for GitHub Actions scripts](#10-configure-iam-role-for-github-actions-scripts)
  - [10.1 Getting an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`](#101-getting-an-aws_access_key_id-and-aws_secret_access_key)
    - [10.1.1 Creating a new GitHub Actions user](#1011-creating-a-new-github-actions-user)
    - [10.1.2 Creating new access keys](#1012-creating-new-access-keys)

## 0. General Information

### 0.1 Project Goals

To build a modular personality assessment platform.

### 0.1.1 Reference Models

The personality assessment platform has or is being modeled after the following websites or platforms:

#### 0.1.1.1 [yourPersonality.net](https://dream-owl.com/attachment/)

This is a site of [Dr. R. Chris Fraley]((https://psychology.illinois.edu/directory/profile/rcfraley)), a Professor at the Department of Psychology at the University of Illinois at Urbana-Champaign.

**Longitudinal Data Visualization:**

- Incorporate a visualization of the user's test/assessment results over time to clearly show a user's changes to their personality profile over time.

#### 0.1.1.2. [what-is-my-personality.com](https://www.what-is-my-personality.com)

This is a site of Dr. Brent Roberts.

**Default Available Assessments:**

- Incorporate _cohesively_ as many of the various assessments offered on this site as possible.

**Structure of Assessments:**

- Reuse components to simplify the integration of the handful of assessments

#### 0.1.1.3. [The Social-Emotional-Behavioral (SEB) Skills Lab](https://sebskills.weebly.com)

This is another site of Dr. Brent Roberts.
    - **Default Available Assessments:**
      - Incorporate the scoring information and various forms of the BESSI
      - Incorporate the German, Italian, and Spanish translations of the BESSI

#### 0.1.1.4. [Qualtrics](https://www.qualtrics.com/)

**Modularity:**

- Building a survey from scratch or from a template in Qualtrics should be used to partially model the study or assessment builder in `personality-lab`.
- `personality-lab` lays out a broad list of personality measures and allows administrators to select from the list to create an assessment for their study.

#### 0.1.1.5. [Prolific](https://www.prolific.com/)

**Structure of Assessments:**

- The creation and management of a research study should be modeled after Prolific's study feature.

**Modularity:**

- Invite-only to each study
  - Participant invitations to a study should be modeled after Prolific, ensuring that a respondent is invited before they participant in completing an assessment for a study.
- Downloadable participant data
  - Participants' test/assessment data may be downloaded as a `.csv` file by a study's administrators.
- Human-readable study IDs
  - Each study is represented by a human-readable ID. Each studyID is generated using a strong and custom form of string compression.
  - Examples:
    - YouTube:
      - URL:
        - `https://www.youtube.com/watch?v=Xg_9F2h89TE`
      - URL slugs, separators, and identifiers:
        - `/watch`: slug to indicate that the user viewing a video
        - `?v=`: query string separator used to identify a unique video ID
        - `Xg_9F2h89TE`: represents the unique ID of the video being watched
    - Spotify:
      - URL:
        `https://open.spotify.com/track/7KA4W4McWYRpgf0fWsJZWB?si=7f7ae9e0d8b74484`
      - URL slugs, separators, and identifiers:
        - `track/`: slug to indicate that the user is viewing a track
        - `7KA4W4McWYRpgf0fWsJZWB`: unique ID that identifies the page of the specific track's page
        - `?si=`: query string separator used to indicate the referral method to the specific track's page
        - `7f7ae9e0d8b74484`: represents the unique ID of the referral method

#### 0.1.1.6. [Linkedin](https://linkedin.com)

**Social:**

- Share test/assessment results on social media:
  - Respondents may share a visualization of their test/assessment results to Linkedin to attract more users to the platform.
- Rate others' test/assessment results
  - Respondents may share a short URL on Linkedin to invite others to view and/or rate their test/assessment results.
- Credential or Certificate of Completion
  - Respondents may share a credential or certificate of completion on Linkedin, a credential/certificate that provides evidence of their completion of multiple test/assessment results on `personality-lab`.

#### 0.1.1.7. [Kahoot](https://kahoot.com/)

> Kahoot's short and gamified quizzes can be used to model shareable personality quizzes on `personality-lab`.

**Social:**

- Individual gamified personality quizzes
  - Respondents may share a link to their results as a shareable URL for friends and  family to access their results and simply rate them or play a short personality quiz.
- Gamified studies
  - Administrators may enable the sharing of the test/assessment results of participants' of a study

#### 0.1.1.8. [Inclivio](https://inclivio.com)

**Platform:**

- Longitudinal research
  - Model the ability to create longitudinal research designs and conduct them

**Pricing:**

- Price per invite or price per license:
  - Use their pricing model as a reference to build the pricing/licensing model for `personality-lab`

#### 0.1.1.9 [In8ness](https://www.in8ness.com)

**User engagement:**

- Engage users after completion of test/assessment
  - Use the [Pop Personality Profiles](https://www.in8ness.com/articles/7) and [Character Personality Comparison](https://www.in8ness.com/articles/8) as a reference to create fictional characters
    - Create personality profiles and test/assessment results of fictional characters using generative AI
    - Offer a user the ability to compare and visualize their test/assessment results and personality profile against fictional characters
    - Offer a user to ask an AI chatbot which fictional characters they would like to compare their personality profile to

**Data visualization:**

- Create and display similar grouped bar plots and radar plots

**Platform:**

- Personality Profile Report
  - Reference In8ness's "Dynamic Web Reports" and "Downloadable PDF Reports" to generate a detailed report of a user's personality profile and/or test/assessment results

### 0.2 Project Structure

```zsh
.
├── nginx
├── caddy
├── nextjs
```

## 1. Local development

Make sure to set up the following for local development:

### `.env.local`

Create an `.env.local` file by running the following command on the CLI:

```zsh
cp .env-example.local .env.local
```

Then fill in the parameters environment variables with the appropriate values:

1. Get the `AUTH0_*` variables from your Auth0 `Applications` settings, under the `Basic Information` menu

    1. As a pre-requisite, make sure to update the `Allowed Callback URLs` and `Allowed Logout URLs` in your Auth0's `Applications` settings to include `localhost`:

        - Allowed Callback URLs:

            ```env
            https://example.com/api/auth/callback,
            https://localhost:3000/api/auth/callback
            ```

        - Allowed Logout URLs:

            ```env
            https://example.com,
            https://localhost:3000
            ```

    2. Then, update the `AUTH0_BASE_URL` to `localhost` in your `.env.local` file, like so:

        ```env
        AUTH0_BASE_URL='https://localhost:3000'
        ```

2. The `encryptCompressEncode()` and `decodeDecompressDecrypt()` functions of the `CSCrypto` (i.e. Client-Side Crypto) class are used to encrypt the shareable ID string, which is used in the shareable link to share a user's assessment results. To encrypt strings on the client, create an initialization vector, i.e. `iv`, and an asymmetric encryption key:

    1. You will need an `iv` and `key` to encrypt the `str` argument.

        1. Note that we we are generating a 128-bit key length because it results in a shorter shareable ID that we place in the shareable URL. (You can generate a key with a 256-bit key length by using a 32-byte initialization vector, i.e. `iv`.):

            ```ts
            // 1. Set the size of the key to 16 bytes
            const bytesSize = new Uint8Array(16)
            
            // 2. Create an initialization vector of 128 bit-length
            const iv = crypto.getRandomValues(bytesSize).toString()
            console.log(`iv:`, iv)

            // 3. Generate a new asymmetric key
            const key = await crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 128
            },
            true,
            ['encrypt', 'decrypt']
            )

            // 4. Export the `CryptoKey`
            const jwk = await crypto.subtle.exportKey('jwk', key)
            const serializedJwk = JSON.stringify(jwk)
            console.log(`serializedJwk:`, serializedJwk)
            ```

        2. Copy the logged `iv` and `serializedJwk` values.
        3. Set these values in your `.env.local` like so:

            ```zsh
            // The values below are merely an example
            NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_KEY="{"alg":"A128GCM","ext":true,"k":"8_kB0wHsI43JNuUhoXPu5g","key_ops":["encrypt","decrypt"],"kty":"oct"}"
            NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_IV="129,226,226,155,222,189,77,19,14,94,116,195,86,198,192,117"
            ```

        4. For cloud-development, make sure to add the `NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_KEY` and `NEXT_PUBLIC_SHARE_RESULTS_ENCRYPTION_IV` variables as GitHub Secrets to the GitHub repository.

### AWS Credentials

Get AWS credentials your `AWS access portal`. They look something like the following:

```zsh
[ROLE_NAME]
aws_access_key_id=ASIA4ID7IBTSMB46LGC4
aws_secret_access_key=6Mu1cPzUz+9yGP12dUBo7HsdVi89bea39YfWUblj
aws_session_token=IQoJb3JpZ2luX2VjEJn//////////wEaCXVzLWVhc3QtMSJIMEYCIQDQoeNwakI4MRGcm110T8pff5htfppKbf7fqUdPMX5e/AIhAIVrV4QclSkNQaajoZklUTX8nNwb2o5auK5mgJV6OVSvKucCCDEQABoMODQyMDgwNDU1OTA4Igwt7f5xGprEfuSyfAwqxALhwKJY/KDqMjaau6Zx4AlpWLIS2rU1vNHg8ADUKI+Lchw2S574eIH7bab2HrtIZIwDRKbOL1ykGeDLkDOvwYiOW4SsnBgLMOcqhmz8ORrgIpQE+NQZkCIezVUaQs8uOTK0jah6Q48Apwc3LRFx5s0hEzr+dV2Vlnyt/qHHskD9SSeGfCFmhTxhyKZdlAiLjRvuMe6D9Aue+vHQadoY4xC3Zx0GtVFeTJZkMPOsaUxKz3WEjZTBIhPO0EoKtafIM5EyfH4TM079XD+69x39BcdMlprLE/AWfeUGdTOzwTUZE5yRMHBrGavUsoqcO/5wP3PF3nfSQWxdYXP64pJniehxp6nFk6vlJmJfi5RzaPdUR1dBYtIc4ex7sT+klLX4qOVA/8Yx5UBiEk1NN49e31yu663303lVj7G/EPbeTdMN4pRnk3kwr6WXswY6pgGxGMrDyA5QxW2yUaDR4nStfNRojzocfeLhvTbxDztGfRU/QtI0p7qPDig3FCetgvrcYFDiFPwQ9iddtaDb418y7mjKMHHYenVSaHY55Iz4rfozMAuHf6jqWMAlBrqMYObP7WDQpSAiFogDAeconLw5Ti/DsS/S9bRF1lhXsckayfPsX6jUOrh0iiDQIxQLqTALgCCXSPUszfUVOhD8PFYq6nRH8loP
```

Copy and paste these values to [`src/utils/aws/constants/index.ts`](./src/utils/aws/constants//index.ts) as shown in the example below:

> NOTE: **NEVER commit AWS credentials!**

```ts
const credentials_ = {
  aws_access_key_id: `ASIA4ID7IBTSMB46LGC4`,
  aws_secret_access_key: `6Mu1cPzUz+9yGP12dUBo7HsdVi89bea39YfWUblj`,
  aws_session_token: `IQoJb3JpZ2luX2VjEJn//////////wEaCXVzLWVhc3QtMSJIMEYCIQDQoeNwakI4MRGcm110T8pff5htfppKbf7fqUdPMX5e/AIhAIVrV4QclSkNQaajoZklUTX8nNwb2o5auK5mgJV6OVSvKucCCDEQABoMODQyMDgwNDU1OTA4Igwt7f5xGprEfuSyfAwqxALhwKJY/KDqMjaau6Zx4AlpWLIS2rU1vNHg8ADUKI+Lchw2S574eIH7bab2HrtIZIwDRKbOL1ykGeDLkDOvwYiOW4SsnBgLMOcqhmz8ORrgIpQE+NQZkCIezVUaQs8uOTK0jah6Q48Apwc3LRFx5s0hEzr+dV2Vlnyt/qHHskD9SSeGfCFmhTxhyKZdlAiLjRvuMe6D9Aue+vHQadoY4xC3Zx0GtVFeTJZkMPOsaUxKz3WEjZTBIhPO0EoKtafIM5EyfH4TM079XD+69x39BcdMlprLE/AWfeUGdTOzwTUZE5yRMHBrGavUsoqcO/5wP3PF3nfSQWxdYXP64pJniehxp6nFk6vlJmJfi5RzaPdUR1dBYtIc4ex7sT+klLX4qOVA/8Yx5UBiEk1NN49e31yu663303lVj7G/EPbeTdMN4pRnk3kwr6WXswY6pgGxGMrDyA5QxW2yUaDR4nStfNRojzocfeLhvTbxDztGfRU/QtI0p7qPDig3FCetgvrcYFDiFPwQ9iddtaDb418y7mjKMHHYenVSaHY55Iz4rfozMAuHf6jqWMAlBrqMYObP7WDQpSAiFogDAeconLw5Ti/DsS/S9bRF1lhXsckayfPsX6jUOrh0iiDQIxQLqTALgCCXSPUszfUVOhD8PFYq6nRH8loP`,
}


export const CREDENTIALS = {
  accessKeyId: credentials_.aws_access_key_id,
  secretAccessKey: credentials_.aws_secret_access_key,
  sessionToken: credentials_.aws_session_token
}
```

Then, call use `CREDENTIALS` in [`src/utils/aws/dynamodb/index.ts`](src/utils/aws/dynamodb/index.ts) and [`src/utils/aws/systems-manager/index.ts`](src/utils/aws/systems-manager/index.ts) like so:

```ts
/* src/utils/aws/dynamodb/index.ts */
import { 
  REGION,
  CREDENTIALS,
} from '../constants'

// const ddbClient = new DynamoDBClient({ region: REGION })
const ddbClient = new DynamoDBClient({ 
  region: REGION,
  credentials: CREDENTIALS
})
```

```ts
/* src/utils/aws/systems-manager/index.ts */
import { 
  REGION,
  CREDENTIALS,
  AWS_PARAMETER_NAMES,
} from '../constants'

// export const ssmClient = new SSMClient({ region: REGION })
export const ssmClient = new SSMClient({ 
  region: REGION,
  credentials: CREDENTIALS,
})
```

### Start Next.js app

To start the Next.js web application, run the following command on the CLI:

```zsh
npx turbo dev
```

## 2. Launch a new AWS EC2 instance on the AWS console

### 2.1. Application and OS Images

1. When launching a new EC2 instance on the AWS console, be sure to use one of the Amazon Machine Images (AMIs). I chose Amazon linux 2023 AMI because it is the fastest.
2. Avoid using 64-bit (Arm) CPU architecture because most software libraries and packages have most of their infrastructure having been tested on use x86 CPU architectures and not on Arm.

### 2.2. Instance Type

Select `t2.micro` because it is uses the lowest vCPU (1vCPU) and GiB Memory (1 GiB Memory)

### 2.3. Key pair (login)

1. Specify a key-pair which is used later for remotely SSH'ing in to the EC2 instance from your machine.
2. Make sure to select `Create a new key pair` whenever you launch a new instance; otherwise, you risk getting confused when you use the same key for more than one EC2 instance, and you have to manage the keys in the appropriate SSH configuration files (e.g. `.ssh`, `authorized_hosts`, `known_hosts` etc.).

Save the generated `.pem` file at the top-most level of the directory of the local GitHub repository.
You will use this to `ssh` into the remote EC2 instance later, both locally within your own machine and remotely through GitHub Actions CI/CD scripts.

### 2.4. Network Settings

Create a new security group, or use an existing security group, that has the following three options enabled:

1. `Allow SSH traffic from` (this is defaulted to `Anywhere 0.0.0.0/0` -- keep the default setting enabled)
2. `Allow HTTPS traffic from the internet` (this is disabled by default)
3. `Allow HTTP traffic from the internet` (this is disabled by default)

## 3. Attach an IAM Role to a newly created EC2 instance

The EC2 instance uses several AWS services and thus requires AWS credentials to make API calls to leverage each of these services.
However, managing these AWS credentials and passing them on to an application is tedious and can come with a ton of security risks.
Thankfully, AWS provides a solution to this issue by allowing the creation of an AWS IAM Role specifically for an EC2 instance to use.

> More information on "IAM roles for Amazon EC2" can be found on the [AWS's official documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)

### 3.1. Pre-requisites

Before you create a new IAM role that will be used specifically for the EC2 instance, make sure you have the following pre-requisites:

1. To create a new IAM role, make sure you have the proper permissions under your organization.
2. Identify the AWS services, and the respective permissions per each AWS service, that your EC2 instance will require to make API calls to.

### 3.2. Create a new IAM role

Once you have the pre-requisites, you can create a new IAM role by following the steps below:

1. To create a new IAM role, go to the IAM service and under `Access Management`, click on the `Roles`.
2. Click the orange `Create role` button on the top right of the `Roles` settings-page.
3. Under the `Select trusted entity` page, and under `Trusted entity type` menu, select `AWS service`.
4. Under the `Use case` menu, click the `Service or use case` select-dropdown menu to choose a service. Select `EC2`.
5. Leave the default radio option, `EC2`, toggled and click `Next`.

### 3.3. Add permissions

For the `personality-lab` Next.js project, we use 4 AWS services:

1. DynamoDB
2. EC2
3. Systems Manager (for Parameter Store)
4. Elastic Container Registry (ECR)
5. API Gateway, specifically the AWS WebSocket API

For simplicity and to save time configuring granular custom permissions policies, we selected broad-general permissions for each of these services:

1. `AmazonDynamoDBFullAccess`
2. `AmazonEC2FullAccess`
3. `AmazonSSMFullAccess`
4. `AmazonEC2ContainerRegistryFullAccess`
    - This managed policy is used to provide the necessary permissions to authenticate with Amazon ECR, which is used to pull images from ECR when SSH'ing into the EC2 instance.
5. `AmazonAPIGatewayAdministrator`
    - This managed policy, and the `AmazonAPIGatewayInvokeFullAccess` policy listed below, is used to ensure that we can use the AWS WebSocket API service through our web application without any unexpected permissions issues.
6. `AmazonAPIGatewayInvokeFullAccess`
7. `AmazonAPIGatewayPushToCloudWatchLogs`
    - This managed policy is used to enable "Custom access logging" for an API's Stage, which requires creating an AWS CloudWatch log group, which uses the "Log format" shown below (a "Log format" is always on a single line, as shown below):

        ```json
        { "requestId":"$context.requestId", "ip":"$context.identity.sourceIp", "dataProcessed": "$context.dataProcessed", "caller":"$context.identity.caller", "user":"$context.identity.user", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "resourcePath":"$context.resourcePath", "status":"$context.status", "protocol":"$context.protocol", "responseLength":"$context.responseLength", "validationErrorString":"$context.error.validationErrorString", "integrationErrorMessage":"$context.integrationErrorMessage", "errorMessage":"$context.errorMessage", "errorResponseType":"$context.error.responseType", "errorMessageString":"$context.error.messageString" }
      ```

Add each of the 7 permissions policies listed above.
Then, click the orange `Next` button on the bottom right.

### 3.4. Name, review, and create the IAM role

1. Enter a short and unique role name for the ec2 instance.

    > This role name will be used later when you need to SSH in to your EC2 instance, so make sure it is short. We named it `ec2-user`

2. Give it a detailed and concise description of what the new IAM role is for.

    > We went with left default description, `Allows EC2 instances to call AWS services on your behalf.`

3. Click the orange `Create role` button at the bottom right to finally create the new IAM role.

### 3.5. Modify IAM role of EC2 instance

Lastly, we want to have the EC2 instance use this newly created IAM role.
To do that, we need to modify the EC2 instance's IAM Role in its settings.

1. Go to the EC2 service
2. Click on the `Instances` tab on the left-side menu
3. Click on your target EC2 instance's ID, highlighted in blue
4. Click on the select-dropdown menu titled, `Actions`
5. Click on the `Security` select-dropdown menu
6. Click on `Modify IAM role`
7. On the `Modify IAM role` page, under the `IAM role` menu, click on the select-dropdown menu and select the IAM role that you created earlier in steps 2 through 4.
8. Click the orange `Update IAM role` button to associate the IAM role with the EC2 instance.

Now, whenever your EC2 instance is running, it will always have AWS credentials with specific permissions to make API calls to the services specified in the permissions policies you selected when created the IAM role.

This saves you time and a headache from manually always having to add the AWS credentials manually or having to write your own system for managing and distributing the AWS credentials to your EC2 instance(s).

## 4. Deploying the Next.js app to AWS EC2 instance and serving it with Caddy

### 4.1. Set up a [Caddy](https://caddyserver.com) server

#### 4.1.1. SSH in to EC2 instance

<!-- 

EC2_USERNAME = ec2-user 
EC2_HOSTNAME = 54.198.211.160

-->

```zsh
ssh -i key-pair-name.pem EC2_USERNAME@EC2_HOSTNAME
```

#### 4.1.2. Install `caddy` from source

Please follow the instructions from [Caddy's official documentation](https://caddyserver.com/docs/running#linux-service).

The instructions below are mostly taken from there:

1. Use `curl` to download the latest version of Caddy from GitHub:

    ```zsh
    curl -o caddy.tar.gz -L "https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_linux_amd64.tar.gz"
    ```

2. Extract the downloaded `.tar` file:

    ```zsh
    tar -zxvf caddy.tar.gz
    ```

3. Move the `caddy` binary into your PATH at `/usr/bin`:

    ```zsh
    sudo mv caddy /usr/bin/
    ```

4. Make the binary executable:

    ```zsh
    chmod +x /usr/bin/caddy
    ```

5. Verify the installation:

    ```zsh
    caddy version
    ```

6. Move downloaded files to `/caddy-download`

    ```zsh
    mkdir ./caddy && mv {LICENSE,README.md,caddy.tar.gz} ./caddy-download/
    ```

7. Create a group named `caddy`

    ```zsh
    sudo groupadd --system caddy
    ```

8. Create a user named caddy with a writeable home directory:

    ```zsh
    sudo useradd --system \
        --gid caddy \
        --create-home \
        --home-dir /var/lib/caddy \
        --shell /usr/sbin/nologin \
        --comment "Caddy web server" \
        caddy
    ```

    If using a config file, be sure it is readable by the caddy user you just created.

9. Next, [choose a systemd unit file](https://caddyserver.com/docs/running#unit-files) based on your use case.

    > NOTE: This involves copying the file contents from [`caddy.service`](https://github.com/caddyserver/dist/blob/master/init/caddy.service).

    **Double-check the `ExecStart` and `ExecReload` directives**. Make sure the binary's location and command line arguments are correct for your installation! For example: if using a config file, change your `--config` path if it is different from the defaults.

    The usual place to save the service file is: `/etc/systemd/system/caddy.service`

    After saving your service file, you can start the service for the first time with the usual systemctl dance:

    ```zsh
    sudo systemctl daemon-reload
    sudo systemctl enable --now caddy
    ```

    Verify that it is running:

    ```zsh
    systemctl status caddy
    ```

    Now you're ready to [use the service](https://caddyserver.com/docs/running#using-the-service)!

### 4.2. Working with [Caddy](http://caddyserver.com) server

A Caddy server uses a `Caddyfile` to configure it, similar to how a NGINX server uses a `.conf` file, usually located somewhere like `/etc/nginx/conf.d/<APP_NAME>.conf`.

For Caddy, we will store `Caddyfile`s under `/etc/caddy`.

Let's create a `Caddyfile`.

1. Create the `/etc/caddy` directory to store `Caddyfile`s

    ```zsh
    sudo mkdir /etc/caddy
    ```

2. Edit a `Caddyfile`:

    Next, we can run the command below to begin editing a Caddyfile:

    ```zsh
    sudo vim /etc/caddy/Caddyfile
    ```

    Paste in the following to ensure that it works to reverse proxy requests made to our Next.js application, which will run on port `3000` from our Docker container:

    ```apacheconf
    example.com {
            encode gzip
            header {
                    Strict-Transport-Security "max-age=31536000;"
                    Access-Control-Allow-Origin "*"
            }
            reverse_proxy localhost:3000
    }
    ```

3. Using the Caddy Service

    Please follow [Caddy's official documentation for this section on how to use the Caddy service](https://caddyserver.com/docs/running#using-the-service). This section closely follows that section, as of the time of writing.

    1. If using a Caddyfile, you can edit your configuration with nano, vi, or your preferred editor:

        ```zsh
        sudo nano /etc/caddy/Caddyfile
        ```

        You can place your static site files in either `/var/www/html` or `/srv`. Make sure the `caddy` user has permission to read the files.

    2. To verify that the service is running:

        ```zsh
        systemctl status caddy
        ```

        The status command will also show the location of the currently running service file.

    3. When running with our official service file, Caddy's output will be redirected to `journalctl`. To read your full logs and to avoid lines being truncated:

        ```zsh
        journalctl -u caddy --no-pager | less +G
        ```

    4. If using a config file, you can gracefully reload Caddy after making any changes:

        ```zsh
        sudo systemctl reload caddy
        ```

    5. You can stop the service with:

        ```zsh
        sudo systemctl stop caddy
        ```

    6. Do not stop the service to change Caddy's configuration. Stopping the server will incur downtime. Use the reload command instead.

    7. The Caddy process will run as the `caddy` user, which has its `$HOME` set to `/var/lib/caddy`. This means that:

        - The default [data storage location](https://caddyserver.com/docs/conventions#data-directory) (for certificates and other state information) will be in `/var/lib/caddy/.local/share/caddy`.
        - The default [config storage location](https://caddyserver.com/docs/conventions#configuration-directory) (for the auto-saved JSON config, primarily useful for the `caddy-api` service) will be in `/var/lib/caddy/.config/caddy`.

#### 4.2.1 Working with multiple domains in a single Caddyfile

You can configure _multiple domains_ in a single Caddyfile for different use cases.

1. To serve the same website over multiple domains, your Caddyfile would need to be configured like so:

    ```apacheconf
    https://example.com, http://example.com, https://example2.com  {
        encode gzip
        header {
            Strict-Transport-Security "max-age=31536000;"
            Access-Control-Allow-Origin "*"
        }
        reverse_proxy localhost:3000
    }
    ```

2. If you want to serve different websites at different domains, it would look something like this:

    ```apacheconf
    example.com {
        root /www/example.com
    }
    
    sub.example.com {
        root /www/sub.example.com
        gzip
        log ../access.log
    }
    ```

#### 4.2.2 Adding the WebSocket server to the Caddyfile

Assuming you are working under a _single domain_ in a single Caddyfile, you can configure your Caddyfile to proxy your WebSocket server through Caddy with a simple configuration as shown below:

  ```apacheconf
  https://example.com  {
      encode gzip
      # App
      header {
          Strict-Transport-Security "max-age=31536000;"
          Access-Control-Allow-Origin "*"
      }
      reverse_proxy localhost:3000

      # WebSocket
      @ws `header({'Connection': '*Upgrade*', 'Upgrade': 'websocket'})`
      reverse_proxy @ws localhost:3001
  }
  ```

This way, Caddy terminates all TLS for you.

#### 4.2.3 Upgrade `caddy`

To upgrade `caddy`, simply stop all running Caddy servers run the following command:

```zsh
caddy upgrade
```

This will replace the current Caddy binary with the latest version from Caddy's download page with the same modules installed, including all third-party plugins that are registered on the Caddy website.

Upgrades do not interrupt running servers; currently, the command only replaces the binary on disk. [This might change in the future](https://caddyserver.com/docs/command-line#caddy-upgrade).

The upgrade process is fault tolerant; the current binary is backed up first (copied beside the current one) and automatically restored if anything goes wrong. If you wish to keep the backup after the upgrade process is complete, you may use the --keep-backup option.

This command may require elevated privileges if your user does not have permission to write to the executable file.

#### 4.2.4 Locate Caddy's TLS certificate and private key

1. To locate Caddy's TLS certificate and private key, start by inspecting the Caddy service logs using the following command:

    ```zsh
    journalctl -u caddy --no-pager | less +G
    ```

    This lets you read the Caddy's full service logs and avoids lines being truncated.

2. Next, in the logs, search for the use of `*/caddy/.config/*`.
3. Navigate to this location within the EC2 instance.

    You can do this in several different ways, but since I found this path to be `/var/lib/caddy/.config/caddy`, I had permissions issues with letting me navigate to it.

    So, I first navigated to `/var/lib/` using:

    ```zsh
    cd /var/lib
    ```

    From there, I then used `vim` with `sudo` privileges to enter the `caddy` directory:

    ```zsh
    sudo vim caddy
    ```

    Running `sudo vim caddy` opened up a `Netrw Directory Listing`, as shown in the image below:

    ![Netrw Directory Listing from sudo vim caddy](./images/Screenshot%202024-10-01%20at%209.01.35 AM.png)

    From here, I navigated to `.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/<DOMAIN_NAME>` to finally find the `.crt` and `.key` files that I needed.

4. You can confirm that you found the correct TLS certificate and key files by double-checking the Caddy service logs.

    Again, run the command to review the Caddy service logs:

    ```zsh
    journalctl -u caddy --no-pager | less +G
    ```

    From the logs, locate the following log:

    ```zsh
    "logger": "tls.obtain", "msg": "certificate obtained successfully"
    ```

    and at the end of this line, you should see the `issuer` to match the `acme` filepath:

    ```zsh
    "issuer":"acme-v02.api.letsencrypt.org-directory"
    ```

### 4.3. On EC2 instance, install Docker, login, and start the Docker daemon

#### 4.3.1. Install `docker`

```zsh
sudo yum install docker -y
```

#### 4.3.2. Run `docker` commands without `sudo`

This step is _**required**_ to pull Docker images from the AWS's Elastic Container Registry (ECR) from within the EC2 instance.

Why is it required? Because the ECR will use IAM role permissions to allow image pulling.

You need to add your current user to the `docker` group.
This will give your user the necessary permissions to interact with the Docker daemon.

To run `docker` commands without `sudo`, do the following:

  1. First, before starting this step, check if the `docker` group exists on your EC2 instance by using the following command:

      ```zsh
      getent group docker
      ```

      If the `docker` group exists, this command will output information about the group, such as:

        ```zsh
        docker:x:1234:
        ```

      If the `docker` group does not exist, the command will not produce any output.

  2. Create the `docker` group if it doesn't exist:

      ```zsh
      sudo groupadd docker
      ```

  3. Add the IAM user to the `docker` group:
        For example, since our IAM user is `ec2-user`:

        ```zsh
        sudo usermod -aG docker ec2-user
        ```

  4. Log out and log back in:
        After adding your user to the `docker` group, you need to log out of your session and log back in for the group changes to take effect.
        Alternatively, you can run the following command to apply the new group permissions without logging out:

        ```zsh
        newgrp docker
        ```

  5. Verify the setup:
      Now you should be able to run Docker commands without `sudo`:

      ```zsh
      docker ps
      ```

      If you see the list of running containers or an empty list without any permission errors, you have successfully configured Docker to run without `sudo`.

Now you should be able to run `docker pull <ECR_IMAGE_URL` within the EC2 instance without the `no basic auth credentials` error.

#### 4.3.3. Login to Docker

After you have installed Docker, login with your username.

<!-- Username where platocrat kept his Docker image is `platocrat` -->

```zsh
docker login -u <USERNAME>
```

When prompted for a password, enter your personal access token that you get from Docker Hub

#### 4.3.4. Start the Docker daemon

```zsh
sudo systemctl restart docker
```

#### 4.3.5. Prune all data from Docker

Make sure to routinely prune all data from Docker running on the AWS EC2 instance.
Before doing so, ALWAYS make sure that you are still able to pull new copies of your desired images from AWS ECR.

To prune all Docker data, run the following command:

```zsh
docker system prune -a
```

### 4.4. Push new commits to GitHub to see the GitHub Action automate the deployment process

### 4.5. Manually start the Next.js app by running the image

#### 4.5.1. Make sure the Docker daemon is running

```zsh
sudo systemctl restart docker
```

#### 4.5.2. Run the image of the Next.js app in detached mode

Make sure to specify the correct port number that is exposed in the [`Dockerfile`](./Dockerfile).

Also, make sure to specify the `<IMAGE_ID>` and *not* the image name of the image that was pulled from the Docker repository.

```zsh
docker run -d -it -p 3000:3000 <IMAGE_ID>
```

Make sure to include the `-d` flag to run the container in "detached" mode, so that we can run other commands while the container is running.

#### 4.5.3. Start or reload the Caddy server

Finally, we can serve the dockerized version of our the Next.js app by starting the Caddy server.
Run the command below to start or reload the Caddy server.

Start `caddy`:

```zsh
sudo systemctl start caddy
```

or reload `caddy`:

```zsh
sudo systemctl reload caddy
```

Then, navigate to your domain to see the hosted site.

## 5. What to do if the SSH key ever gets lost, deleted, or corrupted?

### 5.1. Stop and delete the EC2 instance and launch a new one

Do this from the AWS Console in the browser.

### 5.2. In the menu to launch a new EC2 instance, create a new SSH key pair

RSA is not as secure as ED25519, so select ED25519 as the encryption method.

### 5.3. Follow the instructions on the `Connect` page to SSH into the new EC2 instance

1. Open an SSH client.
2. Locate your private key file. The key used to launch this instance is personality-lab-app.pem
3. Run this command, if necessary, to ensure your key is not publicly viewable.

    ```zsh
    chmod 400 "key-pair-name.pem"
    ```

4. Connect to your instance using its Public DNS

    ```zsh
    EC2_HOSTNAME.compute-1.amazonaws.com
    ```

Example:

```zsh
ssh -i "key-pair-name.pem" EC2_USERNAME@EC2_HOSTNAME.compute-1.amazonaws.com
```

where `EC2_HOSTNAME` the formatted like so:

```zsh
ec2-54-198-211-160
```

## 6. What to do if you want to use a new Elastic IP address?

### 6.1. Release the old Elastic IP address

Release the old Elastic IP address from the AWS console.

### 6.2. Allocate a new Elastic IP address

On the AWS console, on the EC2 service, under the "Network & Security" tab and under "Elastic IPs", click the orange, "Allocate Elastic IP address" button.

### 6.3. Associate the new Elastic IP address to the EC2 instance

1. Toggle the checkbox on the far left of the row of the newly allocated Elastic IP address.
2. Then, click the "Actions" dropdown menu, and select "Associate Elastic IP Address".
3. From this menu, for the Resource type, keep "Instance" selected.
4. For the Instance, select the EC2 instance to associate the Elastic IP address to.
5. Toggle the checkbox to allow reassociation.
6. Finally, click the orange, "Associate" button.

## 7. Working with `screen` to view Next.js and Caddy logs separately

Prerequisites for the `screen` example below:

1. You have an SSH key (`.pem` file) to SSH in to the EC2 instance
2. The latest version of both `docker` and `caddy` are installed on the EC2 instance
3. You have pulled the Next.js Docker image to run as a container
4. You have a `Caddyfile` on the EC2 instance to start the Caddy server from
5. You want to work with two screens: one for `nextjs` and another for `caddy`

### 7.1 Example workflow with `screen`

1. Start the screen session:

    ```sh
    screen -S nextjs
    ```

2. Run the Docker container:

    ```sh
    docker run -it -p 3000:3000 <IMAGE_ID>
    ```

    You can leave this container running since we can detach from this screen without interrupting the container.

3. Detach from the `nextjs` screen session:

    Press `Ctrl+A` then `D`.

4. Switch to a new screen session for the Caddy server:

    ```sh
    screen -S caddy
    ```

5. List all screen sessions to view both the `nextjs`  and `caddy` sessions have been created:

    ```sh
    screen -ls
    ```

6. Start or reload the Caddy server:

    Start `caddy`:

    ```sh
    sudo systemctl start caddy
    ```

    or reload `caddy`:

    ```sh
    sudo systemctl reload caddy
    ```

    You can leave the Caddy server running since we can detach from this screen without interrupting the Caddy server.

7. View the current screen you are on:

    ```sh
    echo $STY
    ```

    This will return the screen ID and name to stdout.

8. Detach from the `caddy` session:

    Press `Ctrl+A` then `D`.

9. List all screen sessions:

    ```sh
    screen -ls
    ```

    You should see both sessions are in the `Detached` state, as opposed to the `Attached` state.

10. In your browser, go to the domain where Caddy is serving the Next.js app

    Click around several pages.

11. In the EC2 instance, re-attach to the `nextjs` session:

    ```sh
    screen -r nextjs
    ```

    You should see the logs from the Next.js server that correspond to the pages you navigated to in your browser.

12. Make code changes to a file, save, commit and push them

13. Stop the Caddy server and the Docker container running the Next.js app
    1. As the GitHub Action is being run from step 12 to build, push, and pull the latest version of the Next.js Docker image to the EC2 instance, first stop the Caddy server that is serving the Next.js Docker container:

        ```sh
        screen -r caddy
        ```

        Then, press `CTL + C` to stop the Caddy server.

        Then, detach from this screen by running:

        ```sh
        screen -d
        ```

        Obviously, you can only run `screen -d` to detach from a screen when you have access to the CLI and are not blocked by a running process.

    2. Next, stop the running Next.js Docker container by going back to the `nextjs` screen session and then pressing `CTL + C` to interrupt the container.

        1. Enter the `nextjs` screen session

            ```sh
            screen -r nextjs
            ```

        2. Interrupt the container by pressing `CTL + C`.
        3. Exit the `nextjs` screen session by running:

            ```sh
            screen -d
            ```

    3. After the latest Docker image has been pulled, restart the Caddy server and Next.js Docker container:
        1. Re-enter the `caddy` screen session:

            ```sh
            screen -r caddy
            ```

            Then, start or reload the Caddy server:

            Start `caddy`:

            ```sh
            sudo systemctl start caddy
            ```

            or reload `caddy`:

            ```sh
            sudo systemctl reload caddy
            ```

            Then, detach from the `caddy` screen session, leaving the Caddy server running, by pressing `CTL + A` and then `D`.

        2. Re-enter the `nextjs` screen session:

            ```sh
            screen -r nextjs
            ```

            Then, start the Next.js Docker container:

            ```sh
            docker run -it -p 3000:3000 <IMAGE_ID>
            ```

            Then, detach from the `nextjs` screen session, to work in a separate screen to start other processes or run other commands, or proceed to step 3.

        3. From your browser, navigate to the domain where the Caddy server is serving the Next.js Docker container.

            After browsing pages on the domain, go back to the EC2 instance `nextjs` screen session:

            ```sh
            screen -r nextjs
            ```

            You should see Next.js returning logs from the page(s) you viewed from your browser.

14. To kill a detached session, run the following command:

    ```sh
    screen -X -S <SESSION_ID_YOU_WANT_TO_KILL> quit
    ```

    For example, after running:

    ```sh
    screen -ls
    ```

    You may see:

    ```sh
    There are screens on:
        3662307.caddy   (Detached)
        82273.nextjs    (Detached)
        82242.caddy     (Detached)
    ```

    To kill the session with the ID, `82273.nextjs`, you can run either of the following commands:

    ```sh
    screen -X -S 82273 quit
    ```

    or

    ```sh
    screen -X -S 82273.nextjs quit
    ```

    Either of these commands kills that session.

## 8. Auth0

### 8.1 Set up a Database Connection for DynamoDB

Follow this [Medium post](https://medium.com/@thedreamsaver/using-amazon-dynamodb-as-a-custom-database-connection-in-auth0-1ec43b8d4c8c) by a that walks through step-by-step how to set up a Database Connection in Auth0 for DynamoDB, from start to finish.

#### 8.1.1 Specify DynamoDB table for IAM User

When creating the custom permission policy for the `Auth0DynamoDBUser` IAM User, make sure to copy and paste the ARN of the DynamoDB table of the `accounts` table for the `Resource` under the property of the permissions policy's JSON.

#### 8.1.2 Database Action Scripts

As a reference, here are the relevant and modified Database Action Scripts that I made, using the tutorial as a guide:

##### 8.2.1.1. Login

```js
function login (email, password, callback) {
  const AWS = require('aws-sdk');
  const { createHash, pbkdf2Sync } = require('crypto');

  const ITERATIONS = 1000000; // 1_000_000
  const KEY_LENGTH = 128;
  const HASH_ALGORITHM = 'sha512';

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: configuration.dynamoDBTable,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  docClient.query(params, function (err, data) {
    if (err) {
      return callback(err);
    } else {
      if (data.Items.length === 0) {
        return callback(new WrongUsernameOrPasswordError(email));
      } else {
        const account = data.Items[0];

        // Use `crypto` to compare the provided password with the hashed 
        // password stored in DynamoDB
        try {
          const salt = account.password.salt;

          const hashToVerify = pbkdf2Sync(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH,
            HASH_ALGORITHM
          ).toString('hex');
  
          const hash = account.password.hash;
          const isMatch = hash === account.password.hash;
  
          // Passwords match, return the user profile
          if (isMatch) {
            const email_ = account.email;
            // Depending on your user schema, you might want to use a different
            // unique identifier
            const user_id = createHash(
              'shake256', 
              16
            ).update(account.email).digest('hex');

            const userProfile = {
              user_id,
              email: email_,
              // Add additional user profile information here as needed
            };
            
            return callback(null, userProfile);
          } else {
            return callback(new WrongUsernameOrPasswordError(email));
          }
        } catch (error) {
          return callback(err);
        }
      }
    }
  });
}
```

##### 8.1.2.2 Create

```js
function create (user, callback) {
  const AWS = require('aws-sdk');
  const { randomBytes, pbkdf2Sync } = require('crypto');

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const ACCOUNT_ADMINS = [
    {
      email: 'bwrobrts@illinois.edu',
      name: 'Brent Roberts',
    },
    {
      email: 'jlmaldo2@illinois.edu',
      name: 'Jack Winfield',
    },
  ];

  const isGlobalAdmin = ACCOUNT_ADMINS.some(
    admin => admin.email === user.email
  );

  // Generate a salt and hash the password
  const salt = randomBytes(16).toString('hex');
  const ITERATIONS = 1000000; // 1_000_000
  const KEY_LENGTH = 128;
  const HASH_ALGORITHM = 'sha512';

  const hash = pbkdf2Sync(
    user.password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    HASH_ALGORITHM
  ).toString('hex');

  const email_ = user.email;
  const password = { hash, salt };
  const updatedAtTimestamp = 0;
  const hasVerifiedEmail = false;
  const createdAtTimestamp = Date.now();

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: configuration.dynamoDBTable,
    Item: {
      email: email_,
      password,
      isGlobalAdmin,
      hasVerifiedEmail,
      updatedAtTimestamp,
      createdAtTimestamp,
      // Add any other user attributes here
    },
    // Ensure the user does not already exist
    ConditionExpression: 'attribute_not_exists(email)'
  };

  docClient.put(params, function (err, data) {
    if (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        // This error means the user already exists
        callback(new Error('User already exists'));
      } else {
        callback(err);
      }
    } else {
      // User was created successfully
      callback(null);
    }
  });
}
```

##### 8.1.2.3 Verify

```js
function verify (email, callback) {
  const AWS = require('aws-sdk');

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const queryParams = {
    TableName: configuration.dynamoDBTable,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
  };

  docClient.query(queryParams, function (err, data) {
    if (err) {
      return callback(err);
    } else {
      if (data.Items.length === 0) {
        return callback(new WrongUsernameOrPasswordError(email));
      } else {
        const account = data.Items[0];
        const createdAtTimestamp = account.createdAtTimestamp;

        const updateParams = {
          TableName: configuration.dynamoDBTable,
          Key: {
            email,
            createdAtTimestamp,
          },
          UpdateExpression: 'set hasVerifiedEmail = :hasVerifiedEmail',
          ExpressionAttributeValues: {
            ':hasVerifiedEmail': true
          },
          ReturnValues: 'UPDATED_NEW',
          // Check if user email exists
          ConditionExpression: 'attribute_exists(email)'
        };

        docClient.update(updateParams, function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
      }
    }
  });
}
```

##### 8.1.2.4 Change Password

```js
function changePassword (email, newPassword, callback) {
  const AWS = require('aws-sdk');
  const { randomBytes, pbkdf2Sync } = require('crypto');

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  // First, hash the new password
  const salt = randomBytes(16).toString('hex');
  const ITERATIONS = 1000000; // 1_000_000
  const KEY_LENGTH = 128;
  const HASH_ALGORITHM = 'sha512';

  const hash = pbkdf2Sync(
    newPassword,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    HASH_ALGORITHM
  ).toString('hex');

  const updatedPassword = { hash, salt };

  const queryParams = {
    TableName: configuration.dynamoDBTable,
    KeyConditionExpression:  'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
  };

  // Perform query to get the `createdAtTimestamp` which is required for 
  // Put, Post, and Update operations on the `accounts` table
  docClient.query(queryParams, function (err, data) {
    if (err) {
      return callback(err);
    } else {
      if (data.Items.length === 0) {
        return callback(new WrongUsernameOrPasswordError(email));
      } else {
        const account = data.Items[0];
        const createdAtTimestamp = account.createdAtTimestamp;

        const updateParams = {
          TableName: configuration.dynamoDBTable,
          Key: {
            email,
            createdAtTimestamp,
          },
          UpdateExpression: 'set password = :password',
          ExpressionAttributeValues: {
            ':password': updatedPassword
          },
          ReturnValues: 'UPDATED_NEW'
        };

        // Next, update the old password
        docClient.update(updateParams, function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
      }
    }
  });
}
```

##### 8.1.2.5 Get User

```js
function getByEmail(email, callback) {
  const AWS = require('aws-sdk');
  const { createHash } = require('crypto');

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: configuration.dynamoDBTable,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  docClient.query(params, function (err, data) {
    if (err) {
      callback(err);
    } else {
      if (data.Items.length === 0) {
        callback(null);
      } else {
        const account = data.Items[0];
        const email_ = account.email;
        const email_verified = account.email_verified;
        // Use a unique identifier for the user_id
        const user_id = createHash(
          'shake256', 
          16
        ).update(account.email).digest('hex');
        
        const userProfile = {
          user_id,
          email: email_,
          email_verified,
          // Add other user attributes here as needed
        };

        // Return the user profile. Adjust the returned attributes as needed.
        callback(null, userProfile);
      }
    }
  });
}
```

##### 8.1.2.6 Delete

```js
function deleteUser(email, callback) {
  const AWS = require('aws-sdk');

  AWS.config.update({
    accessKeyId: configuration.accessKeyId,
    secretAccessKey: configuration.secretAccessKey,
    region: configuration.region
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: configuration.dynamoDBTable,
    Key: {
      email: email
    },
    ConditionExpression: 'attribute_exists(email)'
  };

  docClient.delete(params, function (err, data) {
    if (err) {
      callback(err);
    } else {
      // Successfully deleted the user
      callback(null);
    }
  });
}
```

### 8.2 Application URIs

Under the `Settings` section of your Auth0 Application, update the `Application URIs` inputs with the following:

1. Application Login URI

    ```sh
    https://example.com/api/auth/login
    ```

2. Allowed Callback URLs

    ```sh
    https://example.com/api/auth/callback, 
    https://localhost:3000/api/auth/callback
    ```

    Things to keep in mind for these callback URLs.
    1. For local development, whenever the local base URL, i.e. `https://localhost:3000`, changes,  remember to also update the value for the `AUTH0_BASE_URL` variable in your `.env.local` file.
    2. For remote development, whenever the remote base URL, i.e. `https://example.com`, changes, remember to also update the value for the `AUTH0_BASE_URL` GitHub Actions secret in your GitHub repository's security settings. The page for this can be found under your repository by going to `Settings` → `Security` → `Secrets and variables` → `Actions`.
  
3. Allowed Logout URLs

    ```sh
    https://example.com,
    https://localhost:3000
    ```

Then, click `Save Changes` to save the changes for your Auth0 Application.

### 8.3 Debugging `Callback URL Mismatch.` error

To debug this error, make sure to inspect the logs for your Auth0 application and view the URL that is being used in the callback.
This URL must be the _exact_ same that is configured in your `Application URIs` settings of your Auth0 application.

To find the logs for your application, click on `Monitoring`, then click on `Logs`.

Next, navigate to your application's URL.

Once you receive the `Callback URL Mismatch.` error, go back to the logs and click on the `Failed Login` or `Failed Logout` log entry and read the object field that named `description` and take note of the URL that is being used.

If the URL that is shown is different than what is configured in your `Application URIs` settings, then make the necessary changes to resolve the error.

> NOTE:
>
> Double check whether your domain uses HTTP or HTTPS. Otherwise, you may be confused to find in your Application's logs that your domain's URL uses either `http` or `https`.

## 9. Working with Docker containers

### 9.1 Enter a Docker container's shell

Sometimes you may want to work within a Docker container.
To do that, you will want to access you access the Docker container's shell by running the following commands:

  1. Start the Docker container in detached mode (assumes your app is running on port 3000):

      ```zsh
      docker run -d -it -p 3000:3000 <IMAGE_ID>
      ```

  2. Get the newly running container's ID:

      ```zsh
      docker ps
      ```

      Copy the ID value to use in the next step.

  3. Step inside of the container's shell:

      ```zsh
      docker exec -it <CONTAINER_ID> /bin/sh
      ```

      Then make your changes within the container.
      Make sure to restart any services or apps within the container.

      ```zsh
      docker container stop <CONTAINER_ID>
      ```

      Then restart the container normally without the detached-mode, `-d`, flag.

#### 9.1.1 Use cases

When working inside of an AWS EC2 instance and running your containers within it, instead of waiting for time-consuming CI/CD builds to complete, you may just want to debug your code within the container itself by stepping inside of it and making the necessary changes.

Stepping inside of a Docker container's shell and making quick changes to debug your container may help to speed up your workflow.

### 9.2 Prune all data from Docker

Make sure to routinely prune all data from Docker running on the AWS EC2 instance.
Before doing so, ALWAYS make sure that you are still able to pull new copies of your desired images from AWS ECR.

To prune all Docker data, run the following command:

```zsh
docker system prune -a
```

## 10. Configure IAM role for GitHub Actions scripts

The GitHub Actions scripts for both the [`personality-lab-app`](https://github.com/platocrat/personality-lab-app) and [`u-websocket`](https://github.com/platocrat/u-websocket) repositories make use of automated deployments on a commit, either via a pull request or to any branch.

Each GitHub Actions script:

1. Builds the Docker image for that repository.
2. Pushes the Docker image to the ECR.
3. Pulls the Docker image from the ECR onto the EC2 instance.
4. Uses the following environment variables that need to be individually added to the each repository's list of GitHub Secrets:
    - `SSH_KEY`: the full contents of the `.pem` file. This `.pem` file must be the same private key that was generated when you created the EC2 instance.
    - `EC2_USERNAME`: The name of the IAM role of the EC2 instance (e.g. `ec2-user`).
    - `EC2_HOSTNAME`: The hostname of the EC2 instance. It is usually the Elastic IP address (e.g. `54.493.101.393`)
    - `AWS_REGION`: The region where the ECR repository is located in (e.g., `us-east-1`).
    - `ECR_REPOSITORY_NAME`: The name of the ECR repository.
    - `AWS_ACCOUNT_ID`: The full Account ID for the AWS account (e.g. `0001-0002-0003`).
    - `AWS_ACCESS_KEY_ID`: Part of the AWS authentication credentials. It is created under the IAM role. See [10.1. Getting an AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY](#101-getting-an-aws_access_key_id-and-aws_secret_access_key).
    - `AWS_SECRET_ACCESS_KEY`: Part of the AWS authentication credentials. It is created under the IAM role. See [10.1. Getting an AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY](#101-getting-an-aws_access_key_id-and-aws_secret_access_key).

### 10.1 Getting an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

#### 10.1.1 Creating a new GitHub Actions user

First, you need an IAM user that is used specifically for GitHub Actions stuff. If you already have a GitHub Actions user, move to the next step, [10.2.2 Creating new access keys](#1022-creating-new-access-keys)

If you don't have one yet, create a new IAM user using the steps outline below:

1. Go to the IAM service in the AWS console.
2. Under the "Access management" dropdown menu on the left, click on "Users".
3. Click the orange "Create user" button to start the process of creating a new IAM user.
4. Enter a name for the new IAM user, e.g. `ec2-user-github-actions`.
5. Leave "access to the AWS Management Console" unchecked.
6. Click Next.
7. On the "Set permissions" step, select "Attach policies directly".
    6.1. Add the `AmazonEC2ContainerRegistryPowerUser` managed policy.
8. Click Next.
9. On the `Review and create` step, click the orange "Create user" button to create the new IAM user.

#### 10.1.2 Creating new access keys

Next, you will create an access key that will be used for your GitHub repository's GitHub Actions script.

1. Go to the IAM service in the AWS console.
2. Under the "Access management" dropdown menu on the left, click on "Users".
3. Click on the IAM user that you are using specifically for GitHub Actions.
4. Click on the "Security credentials" tab.
5. Scroll down to the "Access keys" section and click the white "Create access key" button.
6. On "Access key best practices & alternatives" step, the select the "Application running outside AWS" option and click the Next.
7. Enter a useful description tag value for this secret key. For example, using the name of the repository, e.g. `personality-lab-app` is a great choice.
8. Click the orange "Create access key" button.

After completing the last step, make sure to copy each of the Secret value and the Access ID values.
You will use copy and paste each of these values in the Secrets page for your repository's GitHub Actions Secrets, using the Secret value as the `AWS_SECRET_ACCESS_KEY` and the Access ID value as the `AWS_ACCESS_KEY_ID`.

Steps for how to add Secrets to a GitHub repository can be found on GitHub's official documentation for [Creating secrets for a repository](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).