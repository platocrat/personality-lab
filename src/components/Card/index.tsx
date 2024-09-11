'use client'

// Externals
import { CSSProperties, FC, ReactNode, useState } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type CardProps = {
  description: string | ReactNode
  buttonText?: string
  title?: string
  href?: string
  cssStyle?: CSSProperties | any
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
        { title && (
          <>
          <div style={ { padding: '8px' } }>
            <h2 style={ { textAlign: 'center' } }>
              { title }
            </h2>
          </div>
          </>
        ) }
        <div>
          <div 
            style={{ 
              textAlign: cssStyle?.textAlign ?? 'center',
            }}
          >
            { description }
          </div>
        </div>
        <div
          style={ {
            ...definitelyCenteredStyle,
            margin: cssStyle.formMargin ? '' : '18px 0px 0px 0px',
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
              : buttonText && href && (
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    position: 'relative',
                    margin: '12px 0px'
                  } }
                >
                  <ProgressBarLink href={ href }>
                    <button
                      className={ styles.button }
                      onClick={ (e: any) => handleOnClick(e) }
                      style={{ width: cssStyle?.buttonWidth ?? '70px' }}
                    >
                      { buttonText }
                    </button>
                  </ProgressBarLink>
                </div>
              )
            }        
          </div>
        </div>
      </div>
    </>
  )
}

export default Card