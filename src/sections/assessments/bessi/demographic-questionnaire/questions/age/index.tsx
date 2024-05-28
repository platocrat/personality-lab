// Externals
import { useContext } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Constants
// CSS
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
      <TextOrNumberInput 
        name={ name } 
        onChange={ onAgeChange }
        controls={{ type: 'number' }}
      >
        { ` years` }
      </TextOrNumberInput>
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