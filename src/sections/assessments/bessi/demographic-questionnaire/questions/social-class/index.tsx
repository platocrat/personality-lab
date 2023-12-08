// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
import { BasicRadioInput } from '@/components/Input/Radio'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Enums
import { SocialClass } from '@/utils/bessi/types/enums'
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

export default BessiSocialClass