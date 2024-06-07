// Externals
import { Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicsContext } from '@/contexts/UserDemographicsContext'
// Enums
import { Gender } from '@/utils'
// CSS
import { inputMarginStyle } from '../..'
import styles from '@/app/page.module.css'



const Label = () => {
  const label = `What is your gender?`

  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onGenderChange } = useContext(UserDemographicsContext)

  return (
    <>
      { Object.values(Gender).map((gender: string, i: number) => (
        <Fragment key={ `gender-${i}` }>
          <input
            name='gender'
            type='radio'
            value={ gender }
            required={ true }
            style={ inputMarginStyle }
            className={ styles.radioButtonInput }
            onChange={ (e: any) => onGenderChange(e) }
          />
          { gender }
        </Fragment>
      )) }
    </>
  )
}


const BessiGender = () => {
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

export default BessiGender