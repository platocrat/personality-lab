// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Constants
import { 
  INVALID_CHARS_FOR_NUMBERS 
} from '@/utils/bessi/constants'
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

  return (
    <>
      <input
        required={ true }
        onChange={ (e: any) => onAgeChange(e) }
        style={{ margin: '0px 4px 0px 12px' }}
        type='number'
        step={ 1 }
        min={ 0 }
        name='age'
        onKeyDown={ (e: any): any => {
          if (INVALID_CHARS_FOR_NUMBERS.includes(e.key)) {
            e.preventDefault()
          }
        }}
      />
      { ` years` }
    </>
  )
}


const BessiAge = () => {
  const css = {
    pClassName: styles.bessi_about_you_p,
    spanClassName: styles.bessi_text1,
  }

  return (
    <>
      <BasicRadioInput input={ <Input /> } label={ <Label /> } css={ css }/>
    </>
  )
}

export default BessiAge