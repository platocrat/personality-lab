'use client'

// Externals
import { FC, useState } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// CSS
import styles from '@/app/page.module.css'


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
      <NetworkRequestSuspense
        isLoading={ isLoading }
        spinnerOptions={{
          width: '30',
          height: '30',
          showSpinner: true,
          containerStyle: {
            top: '0px',
            float: 'right',
            right: '28px',
          },
        }}
      >
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
      </NetworkRequestSuspense>
    </>
  )
}


export default AssessmentButton