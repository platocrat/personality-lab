'use client'

// Externals
import Link from 'next/link'
import { CSSProperties, FC, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import Form from './form'
import FormSwitcher from './form-switcher'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


const isFirstStep = true


const LogInOrCreateAnAccount = () => {
  // Strings
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  // Booleans
  const [ isSignUp, setIsSignUp ] = useState<boolean>(false)
  const [ emailExists, setEmailExists ] = useState<boolean>(false)


  const title = isFirstStep 
    ? `Log in or create an account`
    : isSignUp 
      ? `Create an account` 
      : `Log in`
  const description = `to view your scores from previous assessments taken.`
  const buttonText = isFirstStep ? `Next` : `${isSignUp ? 'Sign up' : 'Log in' }`


  // ---------------------------- Regular functions ----------------------------
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

  
  
  // ------------------------------ Async functions ----------------------------
  async function handleLogIn(e: any) {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (response.status === 200) {
        console.log(`data: `, data)
      } else {
        console.error(data.error)
      }
    } catch (error: any) {
      console.error(error.message)
      /**
       * @todo Handle error UI here
      */
     
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
        /**
         * @todo Handle invalid input UI here
        */
       console.error('Invalid input')
       return
      }
      
      try {
        const response = await fetch('/api/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        })
        
        const data = await response.json()
        if (response.status === 200) {
          console.log(`data: `, data)
        } else {
          console.error(data.error)
        }
      } catch (error: any) {
        console.error(error.message)
        /**
         * @todo Handle error UI here
        */
      }
    }
    
    
    async function handleEmailExists(e: any) {
      e.preventDefault()
  
      try {
        const response = await fetch('/api/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        // If email exists
        if (response.status === 200) {
          setIsSignUp(false)
          // If email does NOT exist
        } else if (response.status === 400 || response.status === 500) { 
          setIsSignUp(true)
        } else {
          console.error(
            `Error checking if user's email exists in DynamoDB table. Here is the response: `, 
            response /** @todo is this ok? */
          )
        }
      } catch (error: any) { // Error reading email in DynamoDB
        console.error(
          `Error sending POST request to '/api/check-email' endpoint: `, 
          error.message
        )
        /**
         * @todo Handle error UI here
         */

      }
    }



  return (
    <>
      <Card
        title={ title }
        description={ description }
        cssStyle={{ maxWidth: '450px' }}
        options={{
          hasForm: true,
          isSignUp: isSignUp,
          isFirstStep: isFirstStep,
          formContent: <Form 
            isSignUp={ isSignUp }
            buttonText={buttonText}
            isFirstStep={ isFirstStep }
            setter={{ setEmail, setPassword, setUsername }}
            handler={{ handleLogIn, handleSignUp, handleEmailExists }}
          />
        }}
      />
    </>
  )
}

export default LogInOrCreateAnAccount