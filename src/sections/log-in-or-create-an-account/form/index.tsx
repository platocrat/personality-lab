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
    isSignUp: boolean
    isFirstStep: boolean
    emailExists: boolean
    isEmailIncorrect: boolean
    waitingForResponse: boolean
    isUsernameIncorrect: boolean
    isPasswordIncorrect: boolean
  }
  set: {
    email: Dispatch<SetStateAction<string>>
    password: Dispatch<SetStateAction<string>>
    username: Dispatch<SetStateAction<string>>
    isEmailIncorrect: Dispatch<SetStateAction<boolean>>
    isPasswordIncorrect: Dispatch<SetStateAction<boolean>>
    isUsernameIncorrect: Dispatch<SetStateAction<boolean>>
  }
  handler: {
    handleLogIn: (e: any) => void
    handleSignUp: (e: any) => void
    handleEmailExists: (e: any) => void
  }
}


const debounceTimeout = 200



const Form: FC<FormProps> = ({
  set,
  state,
  handler,
  buttonText,
}) => {
  const [ isPasswordHashing, setIsPasswordHashing ] = useState<boolean>(false)

  const isButtonDisabled = isPasswordHashing || state.waitingForResponse 
    ? true
    : false

  // ------------------------------ Regular functions --------------------------
  const onUsernameChange = (e: any) => {
    const value = e.target.value
    set.username(value)
  }
  
  const onEmailChange = (e: any) => {
    const value = e.target.value
    set.email(value)
  }

  const boxShadow = (formInputs: any[], i: number): '0px 0px 6px 1px red' | '' => {
    const _ = '0px 0px 6px 1px red'
    if (state.isEmailIncorrect && i === 0) return _
    if (state.isUsernameIncorrect && i === 1) return _
    if (state.isPasswordIncorrect && i === 2) return _
    return ''
  } 

  const borderColor = (formInputs: any[], i: number): 'red' | '' => {
    const _ = 'red'
    if (state.isEmailIncorrect && i === 0) return _
    if (state.isUsernameIncorrect && i === 1) return _
    if (state.isPasswordIncorrect && i === 2) return _
    return ''
  }

  // -------------------------- Async functions --------------------------------
  const onPasswordChange = async (e: any) => {
    setIsPasswordHashing(true)
    set.isPasswordIncorrect(false)

    let _ = e.target.value
    
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
      onChange: onEmailChange
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
                { state.isEmailIncorrect && i === 0 ? (
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
                      { `Incorrect email` }
                    </p>
                  </>
                ) : null }
                { state.isUsernameIncorrect && i === 1 ? (
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
                      { `Incorrect username` }
                    </p>
                  </>
                ) : null }
              </Fragment>
            ))}
          </div>

          { state.isPasswordIncorrect ? (
            <>
                <p
                  style={{
                    position: 'relative',
                    bottom: '4px',
                    color: 'red',
                    fontSize: '14px'
                  }}
                >
                  {`Incorrect password`}
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
              { isButtonDisabled 
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