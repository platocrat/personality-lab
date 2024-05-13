// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import NumberInput from '@/components/Input/Number'
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Constants
import { INVALID_CHARS_FOR_NUMBERS } from '@/utils'
// CSS
import { inputMarginStyle } from '../..'
import styles from '@/app/page.module.css'


const Label = () => {
  const label = `What is your age?`

  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onAgeChange } = useContext(UserDemographicContext)  
  const name = 'age'


  return (
    <>
      <NumberInput name={ name } onChange={ onAgeChange }>
        { ` years` }
      </NumberInput>
    </>
  )
}


const BessiAge = () => {
  const classNames = {
    pClassName: styles.bessi_about_you_p,
    spanClassName: styles.bessi_text1,
  }


  return (
    <>
      <InputWrapper 
        input={ <Input /> } 
        label={ <Label /> } 
        options={{
          classNames: classNames
        }}
      />
    </>
  )
}

export default BessiAge