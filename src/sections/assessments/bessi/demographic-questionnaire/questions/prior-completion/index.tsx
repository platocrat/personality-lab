// Externals
import { Fragment, useContext } from 'react'
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
            type='radio'
            required={ true }
            value={ yesOrNo }
            name='prior-completion'
            style={ inputMarginStyle }
            className={ styles.radioButtonInput }
            onChange={ (e: any) => onPriorCompletionChange(e) }
          />
          { yesOrNo }
        </Fragment>
      )) }
    </>
  )
}


const BessiPriorCompletion = () => {
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

export default BessiPriorCompletion