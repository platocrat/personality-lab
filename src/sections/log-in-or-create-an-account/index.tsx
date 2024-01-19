'use client'

// Externals
import Link from 'next/link'
import { CSSProperties, FC, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import Form from './form'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const LogInOrCreateAnAccount = () => {
  // Strings
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  // Booleans
  const [ 
    isPasswordInvalid, 
    setIsPasswordInvalid 
  ] = useState<boolean>(false)
  const [ 
    isUsernameInvalid,
    setIsUsernameInvalid
  ] = useState<boolean>(false)
  const [ 
    waitingForResponse,
    setWaitingForResponse
  ] = useState<boolean>(false)
  const [ isSignUp, setIsSignUp ] = useState<boolean>(false)
  const [ isFirstStep, setIsFirstStep ] = useState<boolean>(true)
  const [ emailExists, setEmailExists ] = useState<boolean>(false)
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)
  const [ isEmailInvalid, setIsEmailInvalid ] = useState<boolean>(false)


  const title = isFirstStep 
    ? `Log in or create an account`
    : isSignUp 
      ? `Create an account` 
      : `Log in`
  const description = isFirstStep 
    ?  `View your scores from previous assessments taken.`
    : isSignUp 
      ? 'Welcome!'
      : 'Welcome back!'
  const buttonText = isFirstStep 
    ? `Next` 
    : `${isSignUp ? 'Sign up' : 'Log in' }`


  // ---------------------------- Regular functions ----------------------------  
  
  
  // ------------------------------ Async functions ----------------------------
  async function handleLogIn(e: any) {
    e.preventDefault()

    setIsEmailInvalid(false)
    setIsUsernameInvalid(false)
    setIsPasswordInvalid(false)
    setWaitingForResponse(true)
    
    try {
      const response = await fetch('/api/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })
      
      const data = await response.json()
      
      if (response.status === 200) {
        const message = data.message

        switch (message) {
          case 'Verified email, username, and password':
            setWaitingForResponse(false)
            setIsEmailInvalid(false)
            setIsUsernameInvalid(false)
            setIsPasswordInvalid(false)
            /**
             * @todo Authenticate the user
             */

            break
          case 'Invalid password':
            setWaitingForResponse(false)
            setIsEmailInvalid(false)
            setIsUsernameInvalid(false)
            setIsPasswordInvalid(true)
            break
          
          case 'Invalid username':
            setWaitingForResponse(false)
            setIsEmailInvalid(false)
            setIsUsernameInvalid(true)
            setIsPasswordInvalid(false)
            break
          
          case 'Invalid username and password':
            setWaitingForResponse(false)
            setIsEmailInvalid(false)
            setIsUsernameInvalid(true)
            setIsPasswordInvalid(true)
            break
          
          case 'Email not found':
            setWaitingForResponse(false)
            setIsEmailInvalid(true)
            setIsUsernameInvalid(false)
            setIsPasswordInvalid(false)
            break
        }
      } else {
        setWaitingForResponse(false)
        setIsEmailInvalid(false)
        setIsUsernameInvalid(false)
        setIsPasswordInvalid(false)

        console.error(`Error verifying log in credentials: `, data.error)
      }
    } catch (error: any) {
      setWaitingForResponse(false)
      setIsEmailInvalid(false)
      setIsUsernameInvalid(false)
      setIsPasswordInvalid(false)
      
      console.error(error)
      /**
       * @todo Handle error UI here
      */
    }
  }
  
  
  async function handleSignUp(e: any) {
    e.preventDefault()
      
    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })
    
      if (response.status === 200) {
        const data = await response.json()
        
        console.log(`data.message: `, data.message)

        // authenticateUser()

        // setIsAuthenticated(true)
      } else {
        const data = await response.json()
        console.error(`Error sending POST request to DynamoDB: `, data.error)
      }
    } catch (error: any) {
      console.error(error)
      /**
       * @todo Handle error UI here
      */
    }
  }

    
  async function handleEmailExists(e: any) {
    e.preventDefault()

    setWaitingForResponse(true)

    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.status === 200) { // If email exists
        const message = data.message

        switch (message) {
          case 'Email exists':
            setWaitingForResponse(false)
            setIsFirstStep(false)
            setIsSignUp(false)
            break

          case 'Email does not exist':
            setWaitingForResponse(false)
            setIsFirstStep(false)
            setIsSignUp(true)    
            break
        }
      } else {
        setWaitingForResponse(false)

        const json = await response.json()
        const error = json.error

        console.error(`Error sending POST request to DynamoDB table:\n`, error)
        /**
         * @todo Handle error UI here
         */
      }
    } catch (error: any) {
      setWaitingForResponse(false)
      console.error(error)
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
            buttonText={ buttonText }
            state={{
              email: email,
              username: username,
              password: password,
              isSignUp: isSignUp,
              isFirstStep: isFirstStep,
              emailExists: emailExists,
              isEmailInvalid: isEmailInvalid,
              waitingForResponse: waitingForResponse,
              isPasswordInvalid: isPasswordInvalid,
              isUsernameInvalid: isUsernameInvalid,
            }}
            set={{ 
              email: setEmail, 
              password: setPassword, 
              username: setUsername,
              isEmailInvalid: setIsEmailInvalid,
              isPasswordInvalid: setIsPasswordInvalid, 
              isUsernameInvalid: setIsUsernameInvalid,
            }}
            handler={{ handleLogIn, handleSignUp, handleEmailExists }}
            />
        }}
      />
    </>
  )
}

export default LogInOrCreateAnAccount