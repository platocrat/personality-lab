// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { YesOrNo } from '@/utils/bessi/types/enums'
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
            required={ true }
            onChange={ (e: any) => onEnglishFluencyChange(e) }
            style={ inputMarginStyle }
            type='radio'
            name='english-fluency'
            value={ yesOrNo }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiEnglishFluency = () => {
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

export default BessiEnglishFluency