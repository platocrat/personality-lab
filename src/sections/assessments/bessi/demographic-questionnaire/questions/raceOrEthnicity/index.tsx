// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { 
  RaceOrEthnicity
} from '@/utils/bessi/types/enums'
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
            onChange={ (e: any) => onRaceOrEthnicityChange(e) }
            style={{ margin: '0px 12px 0px 8px' }}
            type='checkbox'
            name={ `myEthnic_${raceOrEthnicity}` }
            value='1'
          />
          { raceOrEthnicity }
          <br />
        </Fragment>
      )) }
    </>
  )
}



const BessiRaceOrEthnicity = () => {
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

export default BessiRaceOrEthnicity