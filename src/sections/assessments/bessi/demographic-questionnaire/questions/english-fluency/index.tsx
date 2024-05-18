// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { YesOrNo } from '@/utils'
// CSS
import { inputMarginStyle } from '../..'
import styles from '@/app/page.module.css'



const Label = () => {
  const label = `Do you speak English fluently?`

  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onEnglishFluencyChange } = useContext(UserDemographicContext)

  return (
    <>
      { Object.values(YesOrNo).map((yesOrNo: string, i: number) => (
        <Fragment key={ `english-fluency-${i}` }>
          <input
            type='radio'
            value={ yesOrNo }
            required={ true }
            name='english-fluency'
            style={ inputMarginStyle }
            className={ styles.radioButtonInput }
            onChange={ (e: any) => onEnglishFluencyChange(e) }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiEnglishFluency = () => {
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

export default BessiEnglishFluency