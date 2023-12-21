// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { YesOrNo } from '@/utils/bessi/types/enums'
// CSS
import { inputMarginStyle } from '../../..'
import styles from '@/app/page.module.css'


const Label = () => {
  const label = `Are you a parent?`

  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onIsParentChange } = useContext(UserDemographicContext)
  const selectLabel = `family`

  return (
    <>
      { Object.values(YesOrNo).map((yesOrNo: string, i: number) => (
        <Fragment key={ `is-parent-${i}` }>
          <input
            required={ true }
            onChange={ (e: any) => onIsParentChange(e) }
            style={ inputMarginStyle }
            type='radio'
            name='family'
            value={ yesOrNo }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiFamily = () => {
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

export default BessiFamily