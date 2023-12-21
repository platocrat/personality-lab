// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { 
  CurrentMaritalStatus 
} from '@/utils/bessi/types/enums'
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
        onChange={ (e: any) => onCurrentMaritalStatusChange(e) }
        name={ selectLabel }
        style={{ margin: '0px 0px 0px 12px' }}
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

export default BessiCurrentMaritalStatus