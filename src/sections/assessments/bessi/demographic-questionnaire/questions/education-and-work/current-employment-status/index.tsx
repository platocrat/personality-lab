// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { CurrentEmploymentStatus } from '@/utils'
// CSS
import styles from '@/app/page.module.css'


const Label = () => {
  const label = `What is your current employment status?`

  return (
    <>
      { label }
    </>
  )
}

const Input = () => {
  const { onCurrentEmploymentStatusChange } = useContext(UserDemographicContext)
  const selectName = `current-employment-status`

  return (
    <>
      <select 
        required={ true }
        onChange={ (e: any) => onCurrentEmploymentStatusChange(e) }
        name={ selectName }
        style={ { margin: '0px 0px 0px 12px' } }
      >
        <option value={ '' }>{ `Please select` }</option>

        { Object.values(CurrentEmploymentStatus).map((
          currentEmploymentStatus: string,
          i: number
        ) => (
          <Fragment key={ `${ selectName }-${ i }` }>
            <option value={ currentEmploymentStatus }>
              { currentEmploymentStatus }
            </option>
          </Fragment>
        )) }
      </select>
    </>
  )
}


const BessiCurrentEmploymentStatus = () => {
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

export default BessiCurrentEmploymentStatus