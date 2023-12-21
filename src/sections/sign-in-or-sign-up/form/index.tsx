import { definitelyCenteredStyle } from '@/theme/styles'
import { Dispatch, Fragment, SetStateAction } from 'react'


type FormProps = {
  setEmail: Dispatch<SetStateAction<string>>
  setPassword: Dispatch<SetStateAction<string>>
  setUsername: Dispatch<SetStateAction<string>>
}


const Form = ({
  setEmail,
  setUsername,
  setPassword,
}) => {
  function onUsernameChange(e: any) {
    e.preventDefault()
    const value = e.target.value
    setUsername(value)
  }
  
  function onEmailChange(e: any) {
    e.preventDefault()
    const value = e.target.value
    setEmail(value)
  }
  
  function onPasswordChange(e: any) {
    e.preventDefault()
    const value = e.target.value
    setPassword(value)
  }

  
  const formInputs = [
    {
      labelName: `Username`,
      inputName: 'username',
      onChange: onUsernameChange
    },
    {
      labelName: `Email`,
      inputName: 'email',
      onChange: onEmailChange
    },
    {
      labelName: `Password`,
      inputName: 'password',
      onChange: onPasswordChange
    },
  ]


  return (
    <>
      <form 
        style={{
          ...definitelyCenteredStyle,
          margin: '0px 0px 18px 0px'
        }}
      >
        <div
          style={ {
            display: 'flex',
            flexDirection: 'column'
          } }
        >
          { formInputs.map((fi, i: number) => (
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
                  }}
                  />
              </div>
            </Fragment>
          )) }
        </div>
      </form>
    </>
  )
}

export default Form