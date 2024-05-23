// Externals
import { FC } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type FormButtonProps = {
  buttonText: string
  state: {
    isSubmitting: boolean
    hasSubmitted: boolean
  }
}



const FormButton: FC<FormButtonProps> = ({
  state,
  buttonText,
}) => {
  return (
    <>
      { state.isSubmitting || state.hasSubmitted ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          <div style={ { float: 'right' } }>
            <button className={ styles.button } style={ { width: '75px' } }>
              { buttonText }
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default FormButton