// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { Gender } from '@/utils/bessi/types/enums'
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
  const { onGenderChange } = useContext(UserDemographicContext)

  return (
    <>
      { Object.values(Gender).map((gender: string, i: number) => (
        <Fragment key={ `gender-${i}` }>
          <input
            required={ true }
            onChange={ (e: any) => onGenderChange(e) }
            style={ inputMarginStyle }
            type='radio'
            name='gender'
            value={ gender }
          />
          { gender }
        </Fragment>
      )) }
    </>
  )
}


const BessiGender = () => {
  const css = {
    pClassName: styles.bessi_about_you_p,
    spanClassName: styles.bessi_text1,
  }

  return (
    <>
      <BasicRadioInput input={ <Input /> } label={ <Label /> } css={ css } />
    </>
  )
}

export default BessiGender