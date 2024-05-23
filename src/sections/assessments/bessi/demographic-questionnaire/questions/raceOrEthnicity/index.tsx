// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { RaceOrEthnicity } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { inputMarginStyle } from '../..'



const Label = () => {
  const label = `What is your race/ethnicity? Check all that apply.`

  return (
    <>
      { label }
      <br />
    </>
  )
}

const Input = () => {
  const { onRaceOrEthnicityChange } = useContext(UserDemographicContext)

  return (
    <>
      { Object.values(RaceOrEthnicity).map((raceOrEthnicity: string, i: number) => (
        <Fragment key={ `what-is-your-race-or-ethnicity-${i}` }>
          <input
            type='checkbox'
            value={ raceOrEthnicity }
            style={{ margin: '0px 12px 0px 8px' }}
            className={ styles.radioButtonInput }
            name={ `myEthnic_${raceOrEthnicity}` }
            onChange={ (e: any) => onRaceOrEthnicityChange(e) }
          />
          { raceOrEthnicity }
          <br />
        </Fragment>
      )) }
    </>
  )
}



const BessiRaceOrEthnicity = () => {
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

export default BessiRaceOrEthnicity