'use client'

// Externals
import { CSSProperties, FC, ReactNode, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type CardProps = {
  title: string
  description: string | ReactNode
  buttonText?: string
  href?: string
  cssStyle?: CSSProperties
  options?: {
    hasForm?: boolean
    isSignUp?: boolean
    isFirstStep?: boolean
    formContent?: ReactNode
  }
}



const Card: FC<CardProps> = ({
  href,
  title,
  options,
  cssStyle,
  buttonText,
  description,
}) => {
  const [ isLoading, setIsLoading ] = useState(false)


  function handleOnClick(e: any) {
    setIsLoading(true)
  }



  return (
    <>
      <div
        style={{ ...cssStyle }}
        className={ styles.card }
      >
        <div style={ { padding: '8px' } }>
          <h2 style={ { textAlign: 'center' } }>
            { title }
          </h2>
        </div>
        <div>
          <div style={ { textAlign: 'center' } }>
            { description }
          </div>
        </div>
        <div
          style={ {
            ...definitelyCenteredStyle,
            margin: '18px 0px 0px 0px',
          } }
        >
          <div 
            style={{
              width: '100%',
              display: 'block',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            { options?.formContent 
              ? options?.formContent 
              : typeof href === 'string' && (
              <>
                { isLoading
                  ? (
                    <>
                      <div
                        style={ {
                          ...definitelyCenteredStyle,
                          position: 'relative',
                          marginBottom: '12px',
                        } }
                      >
                        <Spinner height='30' width='30' />
                      </div>
                    </>
                  ) : (
                    <>
                      <div 
                        style={{ 
                          ...definitelyCenteredStyle,
                          position: 'relative',
                          marginBottom: '12px'
                        }}
                      >
                        <ProgressBarLink href={ href }>
                          <button 
                            style={{ width: '70px' }}
                            className={ styles.button }
                            onClick={ (e: any) => handleOnClick(e) }
                          >
                            { buttonText }
                          </button>
                        </ProgressBarLink>
                      </div>
                    </>
                  )
                }
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Card