'use client';

// Externals
import Link from 'next/link'
import { CSSProperties, FC } from 'react'
// Locals
import Card from '@/components/Card'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type CreateAnAccountProps = {
  onSignUp: (e: any) => void
}


const CreateAnAccount: FC<CreateAnAccountProps> = ({
  onSignUp
}) => {
  const helperText = `Don't have an account?`
  const linkText = `Sign up!`

  const fontStyle: CSSProperties = { fontSize: '13px' }

  return (
    <>
      <div style={{ display: 'flex', marginTop: '12px' }}>
        <p style={{ ...fontStyle, marginRight: '8px' }}>
          { helperText }
        </p>
        <button 
          onClick={ (e: any) => onSignUp(e) }
          className={ styles.buttonNoStyle }
        >
          <p 
            style={{ marginTop: '-1.5px' }}
            className={ styles.blueHyperlink }
          >
            { linkText }
          </p>
        </button>
      </div>
    </>
  )
}


const SignIn = () => {
  const title = `Sign-in or create an account`
  const description = `Sign-in to view your scores from previous assessments taken.`
  // const description = `If you wish to create an account to track your scores or have an account created in July 2023 or more recently, you can do so here. This link will redirect you to one of our newer, and faster servers. You will be able to take one or more surveys, receive feedback, and track your scores over time.`
  const buttonText = `Sign in`
  const href = `link-to-sign-in-form-or-pull-up-sign-in-window`

  const helperText = `Don't have an account?`


  // ------------------------------ Async functions ----------------------------
  async function handleSignIn(e: any) {
    e.preventDefault()

    // 1. Take email and password

    // 2. Check if email-password pair exist in DynamoDB table.

    // 3. If email-password pair exists, sign the user in.

    // 4. If the email-password does NOT exist, throw an error with red text 
    //    saying that the email and password does not match any known users.

    console.log(`user signed in!`)
  }

  async function handleSignUp(e: any) {
    e.preventDefault()

    // 1. Take email, username, and password.

    // 2. Check for a valid email, username, and password.

    // 3. If email, username, and password are valid then store email, username,
    //    and password to DynamoDB table

    // 4. If email, username, and password are INVALID, throw an error where 
    //    appropriate, with the appropriate error message in red text and a red
    //    border on the appropriate input box

    // 5. Wait for confirmation from DynamoDB that sign-in info was stored 
    //    successfully

    // 6. Present the user with a confirmation message and email that they are
    //    now signed up

    console.log(`user signed up!`)
  }


  return (
    <>
      <Card
        href={ href }
        title={ title }
        buttonText={ buttonText }
        description={ description }
        content={ <CreateAnAccount onSignUp={ handleSignUp } /> }
        options={{
          hasLink: true,
          buttonOnClick: handleSignIn,
        }}
        cssStyle={{
          maxWidth: '450px'
        }}
      />
    </>
  )
}

export default SignIn