// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { SocialClass } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const Label = () => {
  const label = `Where would you place yourself on the following spectrum of social class?`

  return (
    <>
      { label }
    </>
  )
}

const Input= () => {
  const { onSocialClassChange } = useContext(UserDemographicContext)

  return (
    <>
      <select 
        required={ true }
        onChange={ (e: any) => onSocialClassChange(e) }
        style={{ margin: '0px 0px 0px 8px' }}
        name={ `social-class` }
      >
        <option value={ `` }>{ `Please select` }</option>

        { Object.values(SocialClass).map((
          socialClass: string,
          i: number
        ) => (
          <Fragment key={ `social-class-${i}` }>
            <option value={ socialClass }>
              { socialClass }
            </option>
          </Fragment>
        )) }
      </select>
    </>
  )
}


const BessiSocialClass = () => {
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

export default BessiSocialClass