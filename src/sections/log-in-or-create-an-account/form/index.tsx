// Externals
import { 
  FC, 
  useMemo, 
  useState, 
  Fragment, 
  Dispatch,
  SetStateAction, 
} from 'react'
// Locals
import { debounce } from '@/utils'
import IncorrectInput from './incorrect-input'
import Spinner from '@/components/Suspense/Spinner'
import PasswordValidation from './password-validation'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


export type FormProps = {
  buttonText: string
  state: {
    email: string
    isSignUp: boolean
    username: string
    password: string
    isFirstStep: boolean
    emailExists: boolean
    isUsernameTaken: boolean
    isEmailIncorrect: boolean
    isPasswordHashing: boolean
    waitingForResponse: boolean
    isUsernameIncorrect: boolean
    isPasswordIncorrect: boolean
  }
  set: {
    email: Dispatch<SetStateAction<string>>
    password: Dispatch<SetStateAction<string>>
    username: Dispatch<SetStateAction<string>>
    isUsernameTaken: Dispatch<SetStateAction<boolean>> 
    isEmailIncorrect: Dispatch<SetStateAction<boolean>>
    isPasswordHashing: Dispatch<SetStateAction<boolean>>
    isPasswordIncorrect: Dispatch<SetStateAction<boolean>>
    isUsernameIncorrect: Dispatch<SetStateAction<boolean>>
  }
  handler: {
    handleLogIn: (e: any) => void
    handleSignUp: (e: any) => void
    handleEmailExists: (e: any) => void
  }
}


const debounceTimeout = 300




const Form: FC<FormProps> = ({
  set,
  state,
  handler,
  buttonText,
}) => {

  // --------------------------- Memoized functions ----------------------------
  const showSpinner = useMemo((): boolean => {
    return (state.isPasswordHashing || state.waitingForResponse) ? true : false
  }, [ state.isPasswordHashing, state.waitingForResponse ])


  const isButtonDisabled = useMemo((): boolean => {
    return state.isPasswordHashing || 
      state.isPasswordIncorrect ||
      state.waitingForResponse ||
      state.isFirstStep && state.email === '' || 
      !state.isFirstStep && state.email === '' ||
      !state.isFirstStep && state.username === '' ||
      !state.isFirstStep && state.password === '' ||
      state.isUsernameTaken ||
      !state.isFirstStep  && state.isSignUp && !isValidPassword(state.password)
        ? true
        : false
  }, [
    state.email,
    state.username,
    state.isSignUp,
    state.password,
    state.isFirstStep,
    state.isUsernameTaken,
    state.isPasswordHashing,
    state.waitingForResponse,
    state.isPasswordIncorrect,
  ])

  const formInputType = (i: number): 'email' | 'password' | 'text' => {
    return i === 1 // this line is equivalent to `if (i === i) {`
      ? 'email'
      : i === 2 // this line is equivalent to `if (i === 2) {`
        ? 'password' 
        : 'text'
  }
  
  // ------------------------------ Regular functions --------------------------
  const boxShadow = (formInputs: any[], i: number): '0px 0px 6px 1px red' | '' => {
    const _ = '0px 0px 6px 1px red'
    if (state.isEmailIncorrect && i === 0) return _
    if (state.isUsernameTaken && i === 1) return _
    if (state.isUsernameIncorrect && i === 1) return _
    if (state.isPasswordIncorrect && i === 2) return _
    return ''
  }


  const borderColor = (formInputs: any[], i: number): 'red' | '' => {
    const _ = 'red'
    if (state.isEmailIncorrect && i === 0) return _
    if (state.isUsernameTaken && i === 1) return _
    if (state.isUsernameIncorrect && i === 1) return _
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
      set.email(_)
    } else {
      set.isEmailIncorrect(true)
    }
  }


  const debouncedOnEmailChange = useMemo(
    (): ((...args: any) => void) => debounce(onEmailChange, debounceTimeout),
    [state.email]
  )


  const onUsernameChange = (e: any): void => {
    set.isUsernameTaken(false)
    set.isUsernameIncorrect(false)
    
    const _ = e.target.value
    const isValid = isValidUsername(_)

    if (isValid) {
      set.isUsernameIncorrect(false)
      set.username(_)
    } else {
      set.isUsernameIncorrect(true)
    }
  }


  const debouncedOnUsernameChange = useMemo(
    (): ((...args: any) => void) => debounce(onUsernameChange, debounceTimeout),
    [state.username]
  )


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
      hashPassword(_).then((hashedPassword: string): void => {
        set.password(hashedPassword)
        set.isPasswordHashing(false)
      })
    } else {
      // 3. Use the raw password to check against the hashedPassword that is 
      // stored in the database
      set.password(_)
      set.isPasswordHashing(false)
    }
  }


  const debouncedOnPasswordChange = useMemo(
    (): ((...args: any) => void) => debounce(onPasswordChange, debounceTimeout),
    [state.password]
  )


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


  function isValidUsername(username: string): boolean {
    // Implement username validation logic
    const conditional = username !== '' && (
      username === undefined ||
      username === null
    )

    if (conditional) {
      return false
    } else {
      return true
    }
  }


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
      const response = await fetch('/api/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const { hashedPassword } = await response.json()
      return hashedPassword
    } catch (error: any) {
      set.isPasswordHashing(false)
      console.error(error)
    }
  }


  /**
   * @todo Finish form submission
   */
  async function handleSubmit(e: any) {
    e.preventDefault()

    if (state.isFirstStep) {
      return handler.handleEmailExists(e)
    } else if (state.isSignUp) {
      return handler.handleSignUp(e)
    } else {
      return handler.handleLogIn(e)
    }
  }


  let formInputs: any[] = [
    {
      name: 'email',
      placeholder: `Enter your email`,
      onChange: debouncedOnEmailChange
    },
    {
      name: 'username',
      placeholder: `Username`,
      onChange: onUsernameChange
    },
    {
      name: 'password',
      placeholder: `Password`,
      onChange: debouncedOnPasswordChange
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
            flexDirection: 'column',
            gap: '4px',
          } }
        >
          <div style={ { display: 'flex', flexDirection: 'column' } }>
            { formInputs.map((fi, i: number) => (
              <Fragment key={ `form-inputs-${i}` }>
                { state.isSignUp && i === 0 && <PasswordValidation /> }

                <div style={ { margin: '0px 0px 8px 0px' } }>
                  <input
                    required
                    id={ fi.name }
                    name={ fi.name }
                    maxLength={ 28 }
                    placeholder={ fi.placeholder }
                    type={ formInputType(i) }
                    onChange={ (e: any) => fi.onChange(e) }
                    style={ {
                      width: `310px`,
                      fontSize: '14.5px',
                      padding: '5px 12px',
                      borderWidth: '0.5px',
                      borderRadius: '1rem',
                      boxShadow: boxShadow(formInputs, i),
                      borderColor: borderColor(formInputs, i),
                    } }
                  />
                </div>

                <IncorrectInput i={ i } state={ state } />

              </Fragment>
            ))}
          </div>

          <div style={ { display: 'block', width: '100%' } }>
            <button
              className={ styles.button }
              disabled={ isButtonDisabled ? true : false }
              style={{
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                backgroundColor: isButtonDisabled ? 'rgba(152, 152, 152, 0.30)' : ''
              }}
              onClick={ (e: any) => handleSubmit(e) }
            >
              { showSpinner 
                ? (
                  <>
                    <Spinner 
                      height='24'
                      width='24' 
                      style={{ position: 'relative',top: '1px' }}
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