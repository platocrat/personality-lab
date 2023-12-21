'use client';

// Externals
import Link from 'next/link'
import { CSSProperties, FC, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import Form from './form'
import CreateAnAccount from './create-an-account-helper'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const SignInOrSignUp = () => {
  // Strings
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  // Booleans
  const [ isSignUp, setIsSignUp ] = useState<boolean>(false)

  const title = `Sign-in or create an account`
  const description = `Sign-in to view your scores from previous assessments taken.`
  const buttonText = `Sign in`


  // ------------------------------ Async functions ----------------------------
  async function handleSignIn(e: any) {
    e.preventDefault()

    // 1. Take email and password
    // try {}

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

  async function handleOnSignUp(e: any) {
    e.preventDefault()
    setIsSignUp(true)
  }



  return (
    <>
      <Card
        title={ title }
        buttonText={ buttonText }
        description={ description }
        cssStyle={{ maxWidth: '450px' }}
        options={{
          hasForm: true,
          hasOnClickHandler: true,
          buttonOnClick: handleSignIn,
          formContent: <Form 
            setEmail={ setEmail }
            setUsername={ setUsername }
            setPassword={ setPassword }
          />,
          helperContent: <CreateAnAccount onSignUp={ handleOnSignUp } />,
        }}
      />
    </>
  )
}

export default SignInOrSignUp