// Externals
import { FC } from 'react'
// Locals
import styles from '@/app/page.module.css'


type FormButtonProps = {
  buttonText: string
}


const FormButton: FC<FormButtonProps> = ({
  buttonText
}) => {
  return (
    <>
      <div style={ { float: 'right' } }>
        <button className={ styles.button } style={ { width: '75px' } }>
          { buttonText }
        </button>
      </div>
    </>
  )
}

export default FormButton