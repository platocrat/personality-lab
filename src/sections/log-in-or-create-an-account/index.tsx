'use client';

// Externals
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CSSProperties, FC, useContext, useMemo, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import Form from './form'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Utils
import { deleteAllCookies } from '@/utils/misc'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const LogInOrCreateAnAccount = () => {
  const router = useRouter()

  // Contexts
  const { setIsAuthenticated } = useContext(AuthenticatedUserContext)

  // Strings
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  // Booleans
  const [ 
    isPasswordIncorrect, 
    setIsPasswordIncorrect 
  ] = useState<boolean>(false)
  const [ 
    isUsernameIncorrect,
    setIsUsernameIncorrect
  ] = useState<boolean>(false)
  const [ 
    waitingForResponse,
    setWaitingForResponse
  ] = useState<boolean>(false)
  const [ isSignUp, setIsSignUp ] = useState<boolean>(false)
  const [ isFirstStep, setIsFirstStep ] = useState<boolean>(true)
  const [ emailExists, setEmailExists ] = useState<boolean>(false)
  const [ isUsernameTaken, setIsUsernameTaken ] = useState<boolean>(false)
  const [ isEmailIncorrect, setIsEmailIncorrect ] = useState<boolean>(false)
  const [ isPasswordHashing, setIsPasswordHashing ] = useState<boolean>(false)


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

    setIsEmailIncorrect(false)
    setIsUsernameIncorrect(false)
    setIsPasswordIncorrect(false)
    setWaitingForResponse(true)

    // Delete all cookies so that we replace the cookie store with a fresh 
    // cookie
    deleteAllCookies()
    
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
            setIsEmailIncorrect(false)
            setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(false)
            
            // Authenticate user
            /**
             * @todo After a user authenticates, the Sign Up/Log In button hangs
             * with a Spinner
             */
            setIsAuthenticated(true)
            router.refresh()
            break

          case 'Incorrect password':
            setWaitingForResponse(false)
            setIsEmailIncorrect(false)
            setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(true)
            break
          
          case 'Incorrect username':
            setWaitingForResponse(false)
            setIsEmailIncorrect(false)
            setIsUsernameIncorrect(true)
            setIsPasswordIncorrect(false)
            break
          
          case 'Incorrect username and password':
            setWaitingForResponse(false)
            setIsEmailIncorrect(false)
            setIsUsernameIncorrect(true)
            setIsPasswordIncorrect(true)
            break
          
          case 'Email not found':
            setWaitingForResponse(false)
            setIsEmailIncorrect(true)
            setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(false)
            break
        }
      } else {
        setWaitingForResponse(false)
        setIsEmailIncorrect(false)
        setIsUsernameIncorrect(false)
        setIsPasswordIncorrect(false)

        console.error(`Error verifying log in credentials: `, data.error)
      }
    } catch (error: any) {
      setWaitingForResponse(false)
      setIsEmailIncorrect(false)
      setIsUsernameIncorrect(false)
      setIsPasswordIncorrect(false)

      /**
       * @todo Handle error UI here
      */
      throw new Error(error)
    }
  }
  
  
  async function handleSignUp(e: any) {
    e.preventDefault()

    setIsUsernameTaken(false)
    setWaitingForResponse(true)

    // Delete all cookies so that we replace the cookie store with a fresh 
    // cookie
    deleteAllCookies()

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
        setWaitingForResponse(false)
        const message = data.message
        
        switch (message) {
          case 'Username exists':
            setIsUsernameTaken(true)
            break

          case 'User has successfully signed up':
            // Authenticate user
            /**
             * @todo After a user authenticates, the Sign Up/Log In button hangs
             * with a Spinner
             */
            setIsAuthenticated(true)
            router.refresh()
            break
        }
      } else {
        setWaitingForResponse(false)
        throw new Error(`Error signing up: `, data.error)
      }
    } catch (error: any) {
      setWaitingForResponse(false)
      /**
       * @todo Handle error UI here
      */
      throw new Error(error)
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
        const error = data.error
        console.error(`Error sending POST request to DynamoDB table: `, error)
        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error sending POST request to DynamoDB table!`)
      }
    } catch (error: any) {
      setWaitingForResponse(false)
      /**
       * @todo Handle error UI here
       */
      throw new Error(error)
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
              isUsernameTaken: isUsernameTaken,
              isEmailIncorrect: isEmailIncorrect,
              isPasswordHashing: isPasswordHashing,
              waitingForResponse: waitingForResponse,
              isPasswordIncorrect: isPasswordIncorrect,
              isUsernameIncorrect: isUsernameIncorrect,
            }}
            set={{ 
              email: setEmail, 
              password: setPassword, 
              username: setUsername,
              isUsernameTaken: setIsUsernameTaken,
              isEmailIncorrect: setIsEmailIncorrect,
              isPasswordHashing: setIsPasswordHashing,
              isPasswordIncorrect: setIsPasswordIncorrect,
              isUsernameIncorrect: setIsUsernameIncorrect,
            }}
            handler={{ handleLogIn, handleSignUp, handleEmailExists }}
            />
        }}
      />
    </>
  )
}

export default LogInOrCreateAnAccount