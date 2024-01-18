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
import Spinner from '@/components/Suspense/Spinner'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type FormProps = {
  buttonText: string
  state: {
    email: string
    isSignUp: boolean
    username: string
    password: string
    isFirstStep: boolean
    emailExists: boolean
    isEmailInvalid: boolean
    waitingForResponse: boolean
    isUsernameInvalid: boolean
    isPasswordInvalid: boolean
  }
  set: {
    email: Dispatch<SetStateAction<string>>
    password: Dispatch<SetStateAction<string>>
    username: Dispatch<SetStateAction<string>>
    isEmailInvalid: Dispatch<SetStateAction<boolean>>
    isPasswordInvalid: Dispatch<SetStateAction<boolean>>
    isUsernameInvalid: Dispatch<SetStateAction<boolean>>
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
  const [ isPasswordHashing, setIsPasswordHashing ] = useState<boolean>(false)

  const showSpinner = isPasswordHashing || state.waitingForResponse
    ? true
    : false

  const isButtonDisabled = isPasswordHashing || state.waitingForResponse ||
    state.email === '' && state.isFirstStep || 
    state.email === '' && !state.isFirstStep ||
    state.username === '' && !state.isFirstStep || 
    state.password === '' && !state.isFirstStep
      ? true
      : false

  // ------------------------------ Regular functions --------------------------
  const onUsernameChange = (e: any) => {
    set.isUsernameInvalid(false)
    
    const value = e.target.value
    const isValid = isValidUsername(value)

    if (isValid) {
      set.isUsernameInvalid(false)
      set.password(value)
    } else {
      set.isUsernameInvalid(true)
    }
    
    set.username(value)
  }

  const debouncedOnUsernameChange = useMemo(
    (): ((...args: any) => void) => debounce(onUsernameChange, debounceTimeout),
    []
  )
    
  const onEmailChange = (e: any) => {
    set.isEmailInvalid(false)
    
    const value = e.target.value
    const isValid = isValidEmail(value)
    
    if (isValid) {
      set.isEmailInvalid(false)
      set.email(value)
    } else {
      set.isEmailInvalid(true)
    }
  }
  
  const debouncedOnEmailChange = useMemo(
    (): ((...args: any) => void) => debounce(onEmailChange, debounceTimeout),
    []
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

  function isValidPassword(password: string): boolean {
    // Implement password validation logic
    const conditional = password !== '' && (
      password === undefined ||
      password === null
    )

    if (conditional) {
      return false
    } else {
      return true
    }
  }

  const boxShadow = (formInputs: any[], i: number): '0px 0px 6px 1px red' | '' => {
    const _ = '0px 0px 6px 1px red'
    if (state.isEmailInvalid && i === 0) return _
    if (state.isUsernameInvalid && i === 1) return _
    if (state.isPasswordInvalid && i === 2) return _
    return ''
  } 

  const borderColor = (formInputs: any[], i: number): 'red' | '' => {
    const _ = 'red'
    if (state.isEmailInvalid && i === 0) return _
    if (state.isUsernameInvalid && i === 1) return _
    if (state.isPasswordInvalid && i === 2) return _
    return ''
  }

  // -------------------------- Async functions --------------------------------
  const onPasswordChange = async (e: any) => {
    setIsPasswordHashing(true)
    set.isPasswordInvalid(false)

    let _ = e.target.value

    const isValid = isValidPassword(_)

    if (isValid) {
      set.isPasswordInvalid(false)
    } else {
      set.isPasswordInvalid(true)
    }
    
    if (state.isSignUp) {
      // Store encrypted password in database
      _ = await hashPassword(_)
      set.password(_)
      setIsPasswordHashing(false)
    } else {
      // Use raw password to check against hash that is stored in database
      set.password(_)
      setIsPasswordHashing(false)
    }
  }

  const debouncedOnPasswordChange = useMemo(
    (): ((...args: any) => void) => debounce(onPasswordChange, debounceTimeout),
    []
  )

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
      setIsPasswordHashing(false)
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
      onChange: onPasswordChange
    },
  ]

  formInputs = state.isFirstStep ? [formInputs[0]] : formInputs



  return (
    <>
      <form
        style={ {
          ...definitelyCenteredStyle,
          margin: '0px 0px 18px 0px'
        } }
        onSubmit={ (e: any) => handleSubmit(e) }
      >
        <div
          style={ {
            ...definitelyCenteredStyle,
            flexDirection: 'column',
            gap: '4px'
          } }
        >
          <div
            style={ {
              display: 'flex',
              flexDirection: 'column'
            } }
          >
            { formInputs.map((fi, i: number) => (
              <Fragment key={ `form-inputs-${i}` }>
                <div style={ { margin: '0px 0px 8px 0px' } }>
                  <input
                    required
                    id={ fi.name }
                    type={ i === 2 ? 'password' : 'text' }
                    name={ fi.name }
                    maxLength={ 28 }
                    placeholder={ fi.placeholder }
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
                { state.isEmailInvalid && i === 0 ? (
                  <>
                    <p
                      style={ {
                        bottom: '4px',
                        color: 'red',
                        fontSize: '14px',
                        textAlign: 'center',
                        position: 'relative',
                      } }
                    >
                      { `Invalid email` }
                    </p>
                  </>
                ) : null }
                { state.isUsernameInvalid && i === 1 ? (
                  <>
                    <p
                      style={ {
                        bottom: '4px',
                        color: 'red',
                        fontSize: '14px',
                        textAlign: 'center',
                        position: 'relative',
                      } }
                    >
                      { `Invalid username` }
                    </p>
                  </>
                ) : null }
              </Fragment>
            ))}
          </div>

          { state.isPasswordInvalid ? (
            <>
                <p
                  style={{
                    position: 'relative',
                    bottom: '4px',
                    color: 'red',
                    fontSize: '14px'
                  }}
                >
                  {`Invalid password`}
                </p>
            </>
          ) : null }

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