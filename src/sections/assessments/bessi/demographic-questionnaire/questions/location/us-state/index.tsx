// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Constants
import { 
  INVALID_CHARS_EXCEPT_NUMBERS,
} from '@/utils/bessi/constants'
// Enums
import { USState } from '@/utils/bessi/types/enums'
// CSS
import styles from '@/app/page.module.css'



const Label = () => {
  const sectionLabel = `Location`
  const label = `If you currently live in the USA, in which state do you live?`
  
  return (
    <>
      <strong>{ sectionLabel }</strong>
      <br />
      { label }
    </>
  )
}

const Input = () => {
  const { 
    onZipCodeChange, 
    onUsLocationChange 
  } = useContext(UserDemographicContext)

  const inputLabel = `What is your zip code?`
  const selectName = `us-state`
  const inputName = 'zip-code'

  return (
    <>
      <select 
        name={ selectName }
        onChange={ (e: any) => onUsLocationChange(e) }
        style={ { margin: '0px 0px 4px 12px' } }
      >
        <option value={ 'Select' }>{ `Please select` }</option>

        { Object.values(USState).map((usState: string, i: number) => (
          <Fragment key={ `${selectName}-${i}` }>
            <option value={ usState }>{ usState }</option>
          </Fragment>
        )) }
      </select>
      <br />

      { inputLabel }
      <input
        onChange={ (e: any) => onZipCodeChange(e) }
        style={{ margin: '0px 0px 0px 12px' }}
        type='text'
        maxLength={ 5 }
        name={ inputName }
        onKeyDown={ (e: any): any => {
          if (INVALID_CHARS_EXCEPT_NUMBERS.includes(e.key)) {
            e.preventDefault()
          }
        } }
      />
    </>
  )
}


const BessiUsState = () => {
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

export default BessiUsState