// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Constants
import { 
  INVALID_CHARS_WITH_NUMBERS 
} from '@/utils/assessments/bessi/constants'
// CSS
import styles from '@/app/page.module.css'



const Label = () => {
  const label = `If you currently live outside of the USA, in what country do you live?`
  
  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onForeignLocationChange } = useContext(UserDemographicContext)
  const name = `foreign-country`

  return (
    <>
      <input
        onChange={ (e: any) => onForeignLocationChange(e) }
        style={ { margin: '0px 0px 0px 12px' } }
        type='text'
        name={ name }
        onKeyDown={ (e: any): any => {
          if (INVALID_CHARS_WITH_NUMBERS.includes(e.key)) {
            e.preventDefault()
          }
        } }
      />
    </>
  )
}


const BessiForeignCountry = () => {
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

export default BessiForeignCountry