'use client'

// Externals
import {
  useState,
  useContext,
} from 'react'
import { useRouter } from 'next/navigation'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import Form from './form'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// Utils
import {
  deleteAllCookies,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const LogInOrCreateAnAccount = () => {
  // Hooks
  const router = useRouter()
  // Contexts
  const {
    email,
    // username,
    setEmail,
    // setUsername,
    setIsGlobalAdmin,
    setIsParticipant,
    setIsAuthenticated,
  } = useContext<SessionContextType>(SessionContext)
  // -------------------------------- States -----------------------------------
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
    isWaitingForResponse,
    setIsWaitingForResponse
  ] = useState<boolean>(false)
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [isFirstStep, setIsFirstStep] = useState<boolean>(true)
  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false)
  const [isEmailIncorrect, setIsEmailIncorrect] = useState<boolean>(false)
  const [isPasswordHashing, setIsPasswordHashing] = useState<boolean>(false)
  // Custom
  const [
    password,
    setPassword
  ] = useState<{ hash: string, salt: string }>({ hash: '', salt: '' })


  // ------------------------------ Constants ----------------------------------
  const title = isFirstStep
    ? `Log in or create an account`
    : isSignUp
      ? `Create an account`
      : `Log in`
  const description = isFirstStep
    ? `View your scores from previous assessments taken.`
    : isSignUp
      ? 'Welcome!'
      : 'Welcome back!'
  const buttonText = isFirstStep
    ? `Next`
    : `${isSignUp ? 'Sign up' : 'Log in'}`


  // ---------------------------- Async functions ------------------------------
  async function handleLogIn(e: any) {
    e.preventDefault()

    setIsEmailIncorrect(false)
    // setIsUsernameIncorrect(false)
    setIsPasswordIncorrect(false)
    setIsWaitingForResponse(true)

    // Delete all cookies so that we replace the cookie store with a fresh 
    // cookie
    deleteAllCookies()

    try {
      const response = await fetch('/api/v1/auth/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          // username, 
          password,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const { message, isGlobalAdmin, isParticipant } = json

        switch (message) {
          // case 'Verified email, username, and password':
          case 'Verified email and password':
            setIsEmailIncorrect(false)
            // setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(false)

            // Authenticate user
            setIsParticipant(isParticipant)
            setIsGlobalAdmin(isGlobalAdmin)
            setIsAuthenticated(true)

            router.refresh()

            setIsWaitingForResponse(false)
            break

          case 'Incorrect password':
            setIsWaitingForResponse(false)
            setIsEmailIncorrect(false)
            // setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(true)
            break

          // case 'Incorrect username':
          //   setIsWaitingForResponse(false)
          //   setIsEmailIncorrect(false)
          //   setIsUsernameIncorrect(true)
          //   setIsPasswordIncorrect(false)
          //   break

          // case 'Incorrect username and password':
          case 'Incorrect email and password':
            setIsWaitingForResponse(false)
            setIsEmailIncorrect(false)
            // setIsUsernameIncorrect(true)
            setIsPasswordIncorrect(true)
            break

          case 'Email not found':
            setIsWaitingForResponse(false)
            setIsEmailIncorrect(true)
            // setIsUsernameIncorrect(false)
            setIsPasswordIncorrect(false)
            break
        }
      } else {
        setIsWaitingForResponse(false)
        setIsEmailIncorrect(false)
        // setIsUsernameIncorrect(false)
        setIsPasswordIncorrect(false)

        console.error(`Error verifying log in credentials: `, json.error)
      }
    } catch (error: any) {
      setIsWaitingForResponse(false)
      setIsEmailIncorrect(false)
      // setIsUsernameIncorrect(false)
      setIsPasswordIncorrect(false)

      /**
       * @todo Handle error UI here
      */
      throw new Error(error)
    }
  }


  async function handleSignUp(e: any) {
    e.preventDefault()

    // setIsUsernameTaken(false)
    setIsWaitingForResponse(true)

    // Delete all cookies so that we replace the cookie store with a fresh 
    // cookie
    deleteAllCookies()

    try {
      const response = await fetch('/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          // username,
          password,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const { message, isGlobalAdmin, isParticipant } = json


        switch (message) {
          // case 'Username exists':
          //   setIsUsernameTaken(true)
          //   setIsWaitingForResponse(false)
          //   break

          case 'User has successfully signed up':
            // Authenticate user
            setIsParticipant(isParticipant)
            setIsGlobalAdmin(isGlobalAdmin)
            setIsAuthenticated(true)

            router.refresh()

            setIsWaitingForResponse(false)
            break
        }
      } else {
        setIsWaitingForResponse(false)
        throw new Error(`Error signing up: `, json.error)
      }
    } catch (error: any) {
      setIsWaitingForResponse(false)
      /**
       * @todo Handle error UI here
      */
      throw new Error(error)
    }
  }


  async function handleEmailWithPasswordExists(e: any) {
    e.preventDefault()

    setIsWaitingForResponse(true)

    try {
      const response = await fetch(`/api/v1/auth/email?email=${email}`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 200) { // If email exists
        const message = json.message

        switch (message) {
          case 'Email with password exists':
            setIsWaitingForResponse(false)
            setIsFirstStep(false)
            setIsSignUp(false)
            break

          case 'Email with password does not exist':
            setIsWaitingForResponse(false)
            setIsFirstStep(false)
            setIsSignUp(true)
            break
        }
      } else {
        setIsWaitingForResponse(false)
        const error = json.error
        /**
         * @todo Handle error UI here
         */
        throw new Error(error)
      }
    } catch (error: any) {
      setIsWaitingForResponse(false)
      /**
       * @todo Handle error UI here
       */
      throw new Error(error)
    }
  }

  // --------------------- Props to pass to `FormContent` ----------------------
  const state = {
    password: password,
    isSignUp: isSignUp,
    isFirstStep: isFirstStep,
    // isUsernameTaken: isUsernameTaken,
    isEmailIncorrect: isEmailIncorrect,
    isPasswordHashing: isPasswordHashing,
    isPasswordIncorrect: isPasswordIncorrect,
    // isUsernameIncorrect: isUsernameIncorrect,
    isWaitingForResponse: isWaitingForResponse,
  }
  const set = {
    password: setPassword,
    // isUsernameTaken: setIsUsernameTaken,
    isEmailIncorrect: setIsEmailIncorrect,
    isPasswordHashing: setIsPasswordHashing,
    isPasswordIncorrect: setIsPasswordIncorrect,
    // isUsernameIncorrect: setIsUsernameIncorrect,
    isWaitingForResponse: setIsWaitingForResponse,
  }
  const handler = { handleLogIn, handleSignUp, handleEmailWithPasswordExists }



  return (
    <>
      <div
        style={ { top: 0 } }
        className={ styles.main }
      >
        <Card
          title={ title }
          description={ description }
          cssStyle={ {
            width: '80%',
            marginRight: 'auto',
            marginLeft: 'auto',
            position: 'relative',
            maxWidth: '325px',
          } }
          options={ {
            hasForm: true,
            isSignUp: isSignUp,
            isFirstStep: isFirstStep,
            formContent: (
              <Form
                set={ set }
                state={ state }
                handler={ handler }
                buttonText={ buttonText }
              /> 
            )
          } }
        />
      </div>
    </>
  )
}

export default LogInOrCreateAnAccount