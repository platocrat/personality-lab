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
  const sectionLabel = `Background`
  const label = `Have you completed this questionnaire before?`

  return (
    <>
      <strong>{ sectionLabel }</strong>
      <br />
      { label }
    </>
  )
}

const Input = () => {
  const { onPriorCompletionChange } = useContext(UserDemographicContext)

  return (
    <>
      { Object.values(YesOrNo).map((yesOrNo: string, i: number) => (
        <Fragment key={ `prior-completion-${i}` }>
          <input
            required={ true }
            onChange={ (e: any) => onPriorCompletionChange(e) }
            style={ inputMarginStyle }
            type='radio'
            name='prior-completion'
            value={ yesOrNo }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiPriorCompletion = () => {
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

export default BessiPriorCompletion