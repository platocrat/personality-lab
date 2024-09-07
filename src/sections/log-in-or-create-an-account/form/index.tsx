// Externals
import { 
  FC, 
  useMemo, 
  useState, 
  Fragment, 
  Dispatch,
  useContext,
  SetStateAction,
} from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
// Locals
import IncorrectInput from './incorrect-input'
import PasswordValidation from './password-validation'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Utils
import { H_CAPTCHA_SITE_KEY, debounce } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



export type FormProps = {
  buttonText: string
  state: {
    isSignUp: boolean
    isFirstStep: boolean
    // isUsernameTaken: boolean
    isEmailIncorrect: boolean
    isPasswordHashing: boolean
    // isUsernameIncorrect: boolean
    isPasswordIncorrect: boolean
    isWaitingForResponse: boolean
    password: { hash: string, salt: string }
  }
  set: {
    // isUsernameTaken: Dispatch<SetStateAction<boolean>> 
    isEmailIncorrect: Dispatch<SetStateAction<boolean>>
    isPasswordHashing: Dispatch<SetStateAction<boolean>>
    isPasswordIncorrect: Dispatch<SetStateAction<boolean>>
    // isUsernameIncorrect: Dispatch<SetStateAction<boolean>>
    isWaitingForResponse: Dispatch<SetStateAction<boolean>>
    password: Dispatch<SetStateAction<{ hash: string,  salt: string }>>
  }
  handler: {
    handleLogIn: (e: any) => void
    handleSignUp: (e: any) => void
    handleEmailWithPasswordExists: (e: any) => void
  }
}



const debounceTimeout = 300




const Form: FC<FormProps> = ({
  set,
  state,
  handler,
  buttonText,
}) => {
  // Contexts
  const { 
    email, 
    // username,
    setEmail,
    // setUsername,
  } = useContext<SessionContextType>(SessionContext)
  // Hooks
  const windowWidth = useWindowWidth()
  // States
  const [
    isHCaptchaVerificationSuccessful, 
    setIsHCaptchaVerificationSuccessful
  ] = useState<boolean>(false)


  // --------------------------- Memoized constants ----------------------------
  const hCaptchaSize = useMemo((): 'compact' | 'normal' => {
    return windowWidth <= 800 ? 'compact' : 'normal'
  }, [windowWidth])

  const showSpinner = useMemo((): boolean => {
    return (state.isPasswordHashing || state.isWaitingForResponse) ? true : false
  }, [ state.isPasswordHashing, state.isWaitingForResponse ])


  const isButtonDisabled = useMemo((): boolean => {
    return state.isPasswordHashing || 
      state.isPasswordIncorrect ||
      state.isWaitingForResponse ||
      state.isFirstStep && email === '' || 
      !state.isFirstStep && email === '' ||
      // !state.isFirstStep && username === '' ||
      !state.isFirstStep && state.password.hash === '' ||
      // state.isUsernameTaken ||
      !state.isFirstStep && !isHCaptchaVerificationSuccessful
      // || !state.isFirstStep  && state.isSignUp && !isValidPassword(state.password.hash)
        ? true
        : false
  }, [
    email,
    // username,
    state.isSignUp,
    state.isFirstStep,
    state.password.hash,
    // state.isUsernameTaken,
    state.isPasswordHashing,
    state.isPasswordIncorrect,
    state.isWaitingForResponse,
    isHCaptchaVerificationSuccessful,
  ])
  
  // ------------------------------ Regular functions --------------------------
  const formInputType = (i: number): 'email' | 'password' | 'text' => {
    return i === 0 // this line is equivalent to `if (i === i) {`
      ? 'email'
      : i === 1 // this line is equivalent to `if (i === 2) {`
        ? 'password' 
        : 'text'
  }

  const boxShadow = (formInputs: any[], i: number): '0px 0px 6px 1px red' | '' => {
    const _ = '0px 0px 6px 1px red'
    if (state.isEmailIncorrect && i === 0) return _
    // if (state.isUsernameTaken && i === 1) return _
    // if (state.isUsernameIncorrect && i === 1) return _
    if (state.isPasswordIncorrect && i === 2) return _
    return ''
  }


  const borderColor = (formInputs: any[], i: number): 'red' | '' => {
    const _ = 'red'
    if (state.isEmailIncorrect && i === 0) return _
    // if (state.isUsernameTaken && i === 1) return _
    // if (state.isUsernameIncorrect && i === 1) return _
    if (state.isPasswordIncorrect && i === 2) return _
    return ''
  }


  // ------------------------- Form handler functions --------------------------
  const onEmailChange = (e: any): void => {
    set.isEmailIncorrect(false)
    
    const _ = e.target.value
    const isValid = isValidEmail(_)
    
    if (isValid) {
      set.isEmailIncorrect(false)
      setEmail(_)
    } else {
      set.isEmailIncorrect(true)
    }
  }


  const debouncedOnEmailChange = useMemo(
    (): ((...args: any) => void) => debounce(onEmailChange, debounceTimeout),
    [email]
  )


  // const onUsernameChange = (e: any): void => {
  //   set.isUsernameTaken(false)
  //   set.isUsernameIncorrect(false)
    
  //   const _ = e.target.value
  //   const isValid = isValidUsername(_)

  //   if (isValid) {
  //     set.isUsernameIncorrect(false)
  //     setUsername(_)
  //   } else {
  //     set.isUsernameIncorrect(true)
  //   }
  // }


  // const debouncedOnUsernameChange = useMemo(
  //   (): ((...args: any) => void) => debounce(onUsernameChange, debounceTimeout),
  //   [username]
  // )


  const onPasswordChange = (e: any): void => {
    set.isPasswordHashing(false)
    set.isPasswordIncorrect(false)

    let _ = e.target.value

    if (state.isSignUp) {
      // 1. Validate the inputted password
      const isValid = isValidPassword(_)

      if (isValid) {
        set.isPasswordIncorrect(false)
      } else {
        set.isPasswordHashing(false)
        set.isPasswordIncorrect(true)
        return
      }

      set.isPasswordHashing(true)
      // 2. Store encrypted password in database
      hashPassword(_).then((password: { hash: string, salt: string }): void => {
        set.password(password)
        set.isPasswordHashing(false)
      })
    } else {
      // 3. Use the raw password to check against the hashedPassword that is 
      // stored in the database
      set.password(_)
      set.isPasswordHashing(false)
    }
  }


  function isValidEmail(email: string): boolean {
    // Implement email validation logic
    const conditional = email !== '' && (email === undefined ||
      email === null ||
      email.indexOf('@') === -1 ||
      email.slice(email.indexOf('@')).indexOf('.') === -1)

    if (conditional) {
      return false
    } else {
      return true
    }
  }


  // function isValidUsername(username: string): boolean {
  //   // Implement username validation logic
  //   const conditional = username !== '' && (
  //     username === undefined ||
  //     username === null
  //   )

  //   if (conditional) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }


  function isValidPassword(password: string) {
    /**
     * @dev Checking `state.isSignUp` is required to silence the error that says
     * that `ruleElement.querySelector` is undefined.
     */
    if (state.isSignUp) {
      const _document: any = document

      const green = 'rgb(52, 173, 52)'

      const updateRuleStatus = (ruleId: string, isValid: boolean): void => {
        const ruleElement = _document.getElementById(ruleId)
        const symbolElement = ruleElement.querySelector('.symbol')

        ruleElement.style.color = isValid ? green : 'red'
        symbolElement.textContent = isValid ? '✔️' : '❌'
      }

      // Check conditions
      const hasSymbol = /[^a-zA-Z0-9]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasCapitalLetter = /[A-Z]/.test(password)
      const hasLowercaseLetter = /[a-z]/.test(password)
      const isLengthValid = password.length >= 13

      // Update UI based on conditions
      updateRuleStatus('ruleSymbol', hasSymbol)
      updateRuleStatus('ruleNumber', hasNumber)
      updateRuleStatus('ruleCapital', hasCapitalLetter)
      updateRuleStatus('ruleLowercase', hasLowercaseLetter)
      updateRuleStatus('ruleLength', isLengthValid)

      // Determine overall validity
      return (
        hasNumber &&
        hasSymbol &&
        hasCapitalLetter &&
        hasLowercaseLetter &&
        isLengthValid
      )
    }
  }


  // -------------------------- Async functions --------------------------------
  async function hashPassword(password: string) {
    try {
      const response = await fetch('/api/v1/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const { hash, salt } = await response.json()
      return { hash, salt }
    } catch (error: any) {
      set.isPasswordHashing(false)
      throw new Error(error)
    }
  }


  async function handleSubmit(e: any) {
    e.preventDefault()

    if (state.isFirstStep) {
      return handler.handleEmailWithPasswordExists(e)
    } else if (state.isSignUp) {
      return handler.handleSignUp(e)
    } else {
      return handler.handleLogIn(e)
    }
  }


  async function handleVerificationSuccess(token: string, eKey: string) {
    set.isWaitingForResponse(true)

    const METHOD = 'POST'

    const response = await fetch('/api/v1/auth/hCaptcha', {
      method: METHOD,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email,
        token
      })
    })

    const json = await response.json()

    set.isWaitingForResponse(false)

    if (typeof json.success === 'boolean') {
      setIsHCaptchaVerificationSuccessful(json.success)
    } else {
      throw new Error(`${ json.error }`)
    }
  }


  let formInputs: any[] = [
    {
      name: 'email',
      placeholder: `Enter your email`,
      onChange: debouncedOnEmailChange
    },
    // {
    //   name: 'username',
    //   placeholder: `Username`,
    //   onChange: onUsernameChange
    // },
    {
      name: 'password',
      placeholder: `Password`,
      onChange: onPasswordChange
    },
  ]

  formInputs = state.isFirstStep ? [formInputs[0]] : formInputs



  return (
    <>
      <form
        onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
        style={ { ...definitelyCenteredStyle, margin: '0px 0px 18px 0px' } }
      >
        <div
          style={ {
            ...definitelyCenteredStyle,
            gap: '4px',
            width: '100%',
            maxWidth: '245px',
            flexDirection: 'column',
          } }
        >
          <div 
            style={{ 
              display: 'block', 
              width: '100%', 
              flexDirection: 'column',
            }}
          >
            { formInputs.map((fi, i: number) => (
              <Fragment key={ `form-inputs-${i}` }>
                { state.isSignUp && i === 0 && <PasswordValidation /> }

                <div style={ { display: 'flex', margin: '0px 0px 8px 0px' } }>
                  <input
                    required
                    id={ fi.name }
                    name={ fi.name }
                    maxLength={ 28 }
                    type={ formInputType(i) }
                    placeholder={ fi.placeholder }
                    onChange={ (e: any) => fi.onChange(e) }
                    style={ {
                      width: `100%`,
                      padding: '5px 12px',
                      borderWidth: '0.5px',
                      borderRadius: '1rem',
                      fontSize: 'clamp(12px, 2.5vw, 13.5px)',
                      boxShadow: boxShadow(formInputs, i),
                      borderColor: borderColor(formInputs, i),
                    } }
                  />
                </div>

                <IncorrectInput 
                  i={ i } 
                  state={{
                    isSignUp: state.isSignUp,
                    // isUsernameTaken: state.isUsernameTaken,
                    isEmailIncorrect: state.isEmailIncorrect,
                    // isUsernameIncorrect: state.isUsernameIncorrect,
                    isPasswordIncorrect: state.isPasswordIncorrect,
                  }} 
                />
              </Fragment>
            ))}
          </div>

          { !state.isFirstStep && (
            <>
              <HCaptcha
                size={ hCaptchaSize }
                sitekey={ H_CAPTCHA_SITE_KEY }
                onVerify={ handleVerificationSuccess }
              />
            </>
          )}

          <div style={{ display: 'block', width: '100%' }}>
            <button
              className={ 
                isButtonDisabled 
                  ? '' 
                  : styles.button
              }
              disabled={ isButtonDisabled ? true : false }
              onClick={ (e: any) => handleSubmit(e) }
              style={{
                boxShadow: 
                  isButtonDisabled 
                  ? ' inset 0px 1px 6px rgba(0, 43, 68, 0.412)' 
                  : '',
                width: `100%`,
                borderRadius: `1rem`,
                borderWidth: `1.2px`,
                color: `rgb(244, 244, 244)`,
                height: 'clamp(29px, 6vw, 32px)',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isButtonDisabled ? 'rgba(152, 152, 152, 0.30)' : '',
              }}
            >
              { showSpinner 
                ? (
                  <>
                    <Spinner 
                      width={ 'clamp(18px, 4vw, 22px)' }
                      height={ 'clamp(18px, 4vw, 22px)' }
                      style={{ position: 'relative', top: '1.75px' }}
                    /> 
                  </>
                )
                : buttonText 
              }
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Form