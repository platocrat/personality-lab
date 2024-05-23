// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { YesOrNo } from '@/utils'
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
            type='radio'
            name='family'
            value={ yesOrNo }
            required={ true }
            style={ inputMarginStyle }
            className={ styles.radioButtonInput }
            onChange={ (e: any) => onIsParentChange(e) }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiFamily = () => {
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

export default BessiFamily