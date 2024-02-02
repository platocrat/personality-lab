// Externals
import { FC } from 'react'
// Locals
import InputError from '@/components/Errors/InputError'


type IncorrectInputProps = {
  i: number
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
}


const IncorrectInput: FC<IncorrectInputProps> = ({ i, state }) => {
  const isEmailIncorrect = state.isEmailIncorrect && i === 0 
  const isUsernameCorrect = state.isUsernameIncorrect && i === 1
  const isUsernameTaken = state.isUsernameTaken && i === 1
  const isPasswordIncorrect = !state.isSignUp 
    && state.isPasswordIncorrect 
    && i === 2


  const errorText = (): string => {
    let _ = ''
    
    if (isEmailIncorrect) _ = `Incorrect email`
    if (isUsernameCorrect) _ = `Incorrect username`
    if (isUsernameTaken) _ = `Username is taken`
    if (isPasswordIncorrect) _ = `Incorrect password`

    return _
  }



  return (
    <>
      <InputError conditional={ isEmailIncorrect } errorText={ errorText } />
      <InputError conditional={ isUsernameCorrect } errorText={ errorText } />
      <InputError conditional={ isUsernameTaken } errorText={ errorText } />
      <InputError conditional={ isPasswordIncorrect } errorText={ errorText } />
    </>
  )
}


export default IncorrectInput