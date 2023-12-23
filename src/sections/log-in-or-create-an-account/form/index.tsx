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
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>
  setUsername: Dispatch<SetStateAction<string>>
}


const Form = ({
  isSignUp,
  setEmail,
  buttonText,
  isFirstStep,
  setUsername,
  setPassword,
}) => {
  const debounceTimeout = 700

  // ------------------------------ Regular functions --------------------------
  const onUsernameChange = (e: any) => {
    const value = e.target.value
    setUsername(value)
  }

  const debouncedOnUsernameChange = useMemo(
    (): ((...args: any) => void) => debounce(onUsernameChange, debounceTimeout),
    []
  )
  
  const onEmailChange = (e: any) => {
    const value = e.target.value
    setEmail(value)
  }

  const debouncedOnEmailChange = useMemo(
    (): ((...args: any) => void) => debounce(onEmailChange, debounceTimeout),
    []
  )
  
  // -------------------------- Async functions --------------------------------
  const onPasswordChange = async (e: any) => {
    const value = e.target.value
    const hashedPassword = await hashPassword(value)
    setPassword(value)
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
  }

  
  let formInputs: any = [
    {
      name: 'username',
      placeholder: `Username`,
      onChange: debouncedOnUsernameChange
    },
    {
      name: 'email',
      placeholder: `Enter your email`,
      onChange: debouncedOnEmailChange
    },
    {
      name: 'password',
      placeholder: `Password`,
      onChange: debouncedOnPasswordChange
    },
  ].slice(isSignUp ? 0 : 1)

  formInputs = isFirstStep ? formInputs[1] : formInputs



  return (
    <>
      <form 
        style={{
          ...definitelyCenteredStyle,
          margin: '0px 0px 18px 0px'
        }}
        onSubmit={ (e: any) => handleSubmit(e) }
      >
        <div 
          style={{
            ...definitelyCenteredStyle,
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div
            style={ {
              display: 'flex',
              flexDirection: 'column'
            } }
          >
            { isFirstStep 
              ? (
                <>
                  <div style={ { margin: '0px 0px 8px 0px' } }>
                    <input
                      required
                      type={ 'text' }
                      id={ formInputs.name }
                      name={ formInputs.name }
                      placeholder={ formInputs.placeholder }
                      maxLength={ 28 }
                      onChange={ (e: any) => formInputs.onChange(e) }
                      style={ {
                        fontSize: '14.5px',
                        padding: '5px 12px',
                        borderWidth: '0.5px',
                        borderRadius: '1rem',
                        width: `310px`,
                      } }
                    />
                  </div>
                </>
              ) : formInputs.map((fi, i: number) => (
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
                )
              ) 
            }
          </div>
          <div style={{ display: 'block', width: '100%' }}>
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