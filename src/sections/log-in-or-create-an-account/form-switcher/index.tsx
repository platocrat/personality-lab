// Externals
import { FC, CSSProperties } from 'react'
// Locals
import styles from '@/app/page.module.css'


type FormSwitcherProps = {
  isSignUp: boolean
  handleEmailExists: (e: any) => void
}


const FormSwitcher: FC<FormSwitcherProps> = ({
  isSignUp,
  handleEmailExists,
}) => {
  const HELPER_TEXT = isSignUp 
    ? `Don't have an account?`
    : `Already have an account?`
  const BUTTON_TEXT = isSignUp ? `SIGN UP!` : `SIGN IN!`

  const FONT_STYLE: CSSProperties = { fontSize: '13px' }

  return (
    <>
      <div style={ { display: 'flex', marginTop: '12px' } }>
        <p style={ { ...FONT_STYLE, marginRight: '8px' } }>
          { HELPER_TEXT }
        </p>
        <button
          className={ styles.buttonNoStyle }
          onClick={ (e: any) => handleEmailExists(e) }
        >
          <p
            style={ { marginTop: '-1.5px' } }
            className={ styles.blueHyperlink }
          >
            { BUTTON_TEXT }
          </p>
        </button>
      </div>
    </>
  )
}

export default FormSwitcher