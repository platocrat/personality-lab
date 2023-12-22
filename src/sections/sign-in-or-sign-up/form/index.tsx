// Externals
import { Dispatch, Fragment, SetStateAction, useMemo } from 'react'
// Locals
import { debounce } from '@/utils'
import { definitelyCenteredStyle } from '@/theme/styles'


type FormProps = {
  isSignUp: boolean
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>
  setUsername: Dispatch<SetStateAction<string>>
}


const Form = ({
  isSignUp,
  setEmail,
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

  
  const formInputs = [
    {
      labelName: `Username`,
      inputName: 'username',
      onChange: debouncedOnUsernameChange
    },
    {
      labelName: `Email`,
      inputName: 'email',
      onChange: debouncedOnEmailChange
    },
    {
      labelName: `Password`,
      inputName: 'password',
      onChange: debouncedOnPasswordChange
    },
  ]



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
          style={ {
            display: 'flex',
            flexDirection: 'column'
          } }
        >
          { isSignUp 
            ? (
              formInputs.map((fi, i: number) => (
                <Fragment key={ `form-inputs-${i}` }>
                  <div style={ { margin: '0px 0px 8px 0px' } }>
                    <input
                      required
                      type={ 'text' }
                      id={ fi.inputName }
                      name={ fi.inputName }
                      placeholder={ fi.labelName }
                      maxLength={ 28 }
                      onChange={ (e: any) => fi.onChange(e) }
                      style={ {
                        fontSize: '14.5px',
                        padding: '5px 12px',
                        borderWidth: '0.5px',
                        borderRadius: '1.5rem',
                        width: `310px`,
                      } }
                    />
                  </div>
                </Fragment>
              ))
            )
            : (
              formInputs.slice(1).map((fi, i: number) => (
              <Fragment key={`form-inputs-${i}`}>
                <div style={{ margin: '0px 0px 8px 0px' }}>
                  <input
                    required
                    type={ 'text' }
                    id={ fi.inputName }
                    name={ fi.inputName }
                    placeholder={ fi.labelName }
                    maxLength={ 28 }
                    onChange={ (e: any) => fi.onChange(e) }
                    style={{
                      fontSize: '14.5px',
                      padding: '5px 12px',
                      borderWidth: '0.5px',
                      borderRadius: '1.5rem',
                      width: `310px`,
                    }}
                    />
                </div>
              </Fragment>
            )
          )) }
        </div>
      </form>
    </>
  )
}

export default Form