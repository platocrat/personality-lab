// Externals
import { Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { HighestFormalEducation } from '@/utils'
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
        name={ selectName }
        style={ { margin: '0px 0px 0px 12px' } }
        onChange={ (e: any) => onHighestEducationLevelChange(e) }
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

export default BessiHighestFormalEducation