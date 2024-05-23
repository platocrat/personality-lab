// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { CurrentMaritalStatus } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const Label = () => {
  const sectionLabel = `Marriage and Family`
  const label = `What is your current marital status?`

  return (
    <>
      <strong>{ sectionLabel }</strong>
      <br />
      { label }
    </>
  )
}

const Input = () => {
  const { onCurrentMaritalStatusChange } = useContext(UserDemographicContext)
  const selectLabel = `current-marital-status`

  
  return (
    <>
      <select 
        required={ true }
        name={ selectLabel }
        style={{ margin: '0px 0px 0px 12px' }}
        onChange={ (e: any) => onCurrentMaritalStatusChange(e) }
      >
        <option value={ `` }>{ `Please select` }</option>

        { Object.values(CurrentMaritalStatus).map((
          currentMaritalStatus: string,
          i: number
        ) => (
          <Fragment key={ `${ selectLabel }-${ i }` }>
            <option value={ currentMaritalStatus }>
              { currentMaritalStatus }
            </option>
          </Fragment>
        )) }
      </select>
    </>
  )
}


const BessiCurrentMaritalStatus = () => {
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

export default BessiCurrentMaritalStatus