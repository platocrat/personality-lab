import { FC, CSSProperties } from 'react'
import styles from '@/app/page.module.css'


type CreateAnAccountProps = {
  onSignUp: (e: any) => void
}


const CreateAnAccount: FC<CreateAnAccountProps> = ({
  onSignUp
}) => {
  const helperText = `Don't have an account?`
  const linkText = `Sign up!`

  const fontStyle: CSSProperties = { fontSize: '13px' }

  return (
    <>
      <div style={ { display: 'flex', marginTop: '12px' } }>
        <p style={ { ...fontStyle, marginRight: '8px' } }>
          { helperText }
        </p>
        <button
          onClick={ (e: any) => onSignUp(e) }
          className={ styles.buttonNoStyle }
        >
          <p
            style={ { marginTop: '-1.5px' } }
            className={ styles.blueHyperlink }
          >
            { linkText }
          </p>
        </button>
      </div>
    </>
  )
}

export default CreateAnAccount