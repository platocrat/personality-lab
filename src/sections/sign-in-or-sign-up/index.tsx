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



const SignInOrSignUp = () => {
  // Strings
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  // Booleans
  const [ isSignUp, setIsSignUp ] = useState<boolean>(false)

  const title = isSignUp ? `Create an account` : `Sign in`
  const description = `Sign ${
    isSignUp 
      ? 'up to keep track of' 
      : 'in to view' 
  } your scores from previous assessments taken.`
  const buttonText = `Sign ${isSignUp ? 'up' : 'in' }`


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

  function handleOnSwitchToSignUp(e: any) {
    setIsSignUp(true)
  }

  function handleOnSwitchToSignIn(e: any) {
    setIsSignUp(false)
  }
  
  const onSwitchForm = { handleOnSwitchToSignUp, handleOnSwitchToSignIn }

  // ------------------------------ Async functions ----------------------------
  async function handleSignIn(e: any) {
    e.preventDefault()

    try {
      const response = await fetch('/api/sign-in', {
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
        if (response.ok) {
          console.log(data.message)
        } else {
          throw new Error(data.error)
        }
      } catch (error: any) {
        console.error(error.message)
        /**
         * @todo Handle error UI here
         */
      }
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
          isSignUp: isSignUp,
          hasOnClickHandler: true,
          buttonOnClick: handleSignIn,
          formContent: <Form 
            isSignUp={ isSignUp }
            setEmail={ setEmail }
            setUsername={ setUsername }
            setPassword={ setPassword }
            // /**
            //  * @todo Form `onSubmit` property is in the Form component, which
            //  *       requires the `handleSignIn` and handleSignUp` buttons to 
            //  *       be passed down.
            //  */
            // handleSignIn={}
            // handleSignUp={}
          />,
          helperContent: <FormSwitcher
            /**
             * @dev Use the opposite of `isSignUp` for both of these constants 
             * because the UI displays the opposite of the current form that is
             * displayed.
             */
            isSignUp={ !isSignUp }
            onSwitchForm={ onSwitchForm } 
          />,
        }}
      />
    </>
  )
}

export default SignInOrSignUp