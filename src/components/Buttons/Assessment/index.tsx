'use client'

// Externals
import { FC, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type AssessmentButtonProps = {
  href: string
  buttonText: string
}


/**
 * @dev This component CANNOT be used to submit forms because it uses `<ProgressBarLink>`
 * component which overwrites the functionality of a form element.
 */
const AssessmentButton: FC<AssessmentButtonProps> = ({
  href,
  buttonText
}) => {
  const [ isLoading, setIsLoading ] = useState(false)

  function handleOnClick(e: any) {
    setIsLoading(true)
  }



  return (
    <>
      { isLoading ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              float: 'right',
              right: '28px',
            } }
          >
            <Spinner height='30' width='30' />
          </div>
        </>
      ) : (
        <>
          <div style={ { float: 'right' } }>
            <ProgressBarLink href={ href }>
              <button
                className={ styles.button }
                style={ { width: '80px' } }
                onClick={ (e: any) => handleOnClick(e) }
              >
                { buttonText }
              </button>
            </ProgressBarLink>
          </div>
        </>
      ) }
    </>
  )
}


export default AssessmentButton