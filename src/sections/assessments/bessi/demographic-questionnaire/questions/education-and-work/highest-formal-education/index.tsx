// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { 
  HighestFormalEducation 
} from '@/utils/bessi/types/enums'
// CSS
import styles from '@/app/page.module.css'


const Label = () => {
  const sectionLabel = `Education and Work`
  const label = `What is the highest level of formal education that you have completed?`

  return (
    <>
      <strong>{ sectionLabel }</strong>
      <br />
      { label }
    </>
  )
}

const Input = () => {
  const { onHighestEducationLevelChange } = useContext(UserDemographicContext)
  const selectName = `highest-formal-education`

  return (
    <>
      <select
        required={ true }
        onChange={ (e: any) => onHighestEducationLevelChange(e) }
        style={ { margin: '0px 0px 0px 12px' } }
        name={ selectName }
      >
        <option value={ '' }>{ `Please select` }</option>

        { Object.values(HighestFormalEducation).map((hfe: string, i: number) => (
          <Fragment key={ `${ selectName }-${i}` }>
            <option value={ hfe }>{ hfe }</option>
          </Fragment>
        )) }
      </select>
    </>
  )
}


const BessiHighestFormalEducation = () => {
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

export default BessiHighestFormalEducation