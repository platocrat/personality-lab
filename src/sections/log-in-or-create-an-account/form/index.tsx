// Externals
import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
// Locals
import { debounce } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type FormProps = {
  isSignUp: boolean
  buttonText: string
  emailExists: boolean
  isFirstStep: boolean
  setter: {
    setEmail: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    setUsername: Dispatch<SetStateAction<string>>
  }
  handler: {
    handleLogIn?: (e: any) => void
    handleSignUp?: (e: any) => void
    handleEmailExists?: (e: any) => void
  }
}


const Form = ({
  setter,
  handler,
  isSignUp,
  buttonText,
  isFirstStep,
}) => {
  const debounceTimeout = 700

  // ------------------------------ Regular functions --------------------------
  const onUsernameChange = (e: any) => {
    const value = e.target.value
    setter.setUsername(value)
  }
  
  const onEmailChange = (e: any) => {
    const value = e.target.value
    setter.setEmail(value)
  }
  
  // -------------------------- Async functions --------------------------------
  const onPasswordChange = async (e: any) => {
    const value = e.target.value
    const hashedPassword = await hashPassword(value)
    setter.setPassword(value)
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
      console.error(error)
    }
  }

  /**
   * @todo Finish form submission
   */
  async function handleSubmit(e: any) {
    e.preventDefault()

    if (isFirstStep) {
      return handler.handleEmailExists(e)
    } else if (isSignUp) {
      return handler.handleSignUp(e)
    } else {
      return handler.handleLogIn(e)
    }
  }

  
  let formInputs: any = [
    {
      name: 'username',
      placeholder: `Username`,
      onChange: onUsernameChange
    },
    {
      name: 'email',
      placeholder: `Enter your email`,
      onChange: onEmailChange
    },
    {
      name: 'password',
      placeholder: `Password`,
      onChange: debouncedOnPasswordChange
    },
  ]

  formInputs = isFirstStep ? [formInputs[1]] : formInputs


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
            gap: '12px'
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
                    type={ 'text' }
                    id={ fi.name }
                    name={ fi.name }
                    placeholder={ fi.placeholder }
                    maxLength={ 28 }
                    onChange={ (e: any) => fi.onChange(e) }
                    style={ {
                      fontSize: '14.5px',
                      padding: '5px 12px',
                      borderWidth: '0.5px',
                      borderRadius: '1rem',
                      width: `310px`,
                    } }
                  />
                </div>
              </Fragment>
            ))
            }
          </div>
          <div style={ { display: 'block', width: '100%' } }>
            <button
              className={ styles.button }
              onClick={ (e: any) => handleSubmit(e) }
            >
              { buttonText }
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Form