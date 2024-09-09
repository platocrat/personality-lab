// Externals
import { CSSProperties, FC, ReactNode } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Hooks
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'


type SpinnerOptions = {
  height?: string
  width?: string
  showSpinner?: boolean
  containerStyle?: CSSProperties
  isAssessmentResults?: boolean
}

type NetworkRequestSuspenseProps = {
  children: ReactNode
  isLoading: boolean
  spinnerOptions?: SpinnerOptions
}

type _SpinnerProps = {
  options?: SpinnerOptions
}


const _Spinner: FC<_SpinnerProps> = ({ 
  options
}) => {
  return (
    <>
      { options?.showSpinner ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
              ...options?.containerStyle
            } }
          >
            { options.isAssessmentResults && (
              <>
                <div style={ { marginBottom: '24px' } }>
                  <p>{ `Loading results...` }</p>
                </div>
              </>
            )}
            <Spinner 
              height={ options?.height ?? '40' } 
              width={ options?.width ?? '40' } 
            />
          </div>
        </>
      ) : null }
    </>
  )
}



const NetworkRequestSuspense: FC<NetworkRequestSuspenseProps> = ({
  children,
  isLoading,
  spinnerOptions,
}) => {
  return (
    <>
      { isLoading 
        ? (
          <>
            <_Spinner options={ spinnerOptions } /> 
          </>
        )
        : (
          <>
            { children }
          </>
        )
      }
    </>
  )
}


export default NetworkRequestSuspense