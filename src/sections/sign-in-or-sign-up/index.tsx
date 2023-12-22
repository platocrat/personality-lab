'use client'

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

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log(data.message)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error(error.message)
      // Handle error UI here
    }
  }

  async function handleSignUp(e: any) {
    e.preventDefault()

     // Validate email, username, and password
    if (
      !isValidEmail(email) || 
      !isValidUsername(username) || 
      !isValidPassword(password)
    ) {
        // Handle invalid input UI here
        console.error('Invalid input')
        return
    }


    try {
        const response = await fetch('/api/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        })

        const data = await response.json()
        if (response.ok) {
          console.log(data.message)
        } else {
          throw new Error(data.error)
        }
      } catch (error: any) {
        console.error(error.message)
        // Handle error UI here
      }
  }

  function isValidEmail(email: string) {
    // Implement email validation logic
    
    return true
  }

  function isValidUsername(username: string) {
    // Implement username validation logic
    return true
  }

  function isValidPassword(password: string) {
    // Implement password validation logic
    return true
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