'use client';

// Externals
import Link from 'next/link'
import { CSSProperties, FC, ReactNode } from 'react'
// Locals
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
    buttonOnClick: (e: any) => void
    handleEmailExists?: (e: any) => void
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
  function handleOnClick(e: any) {
    if (options?.isFirstStep) {
      return options?.buttonOnClick(e)
    } else if (options?.handleEmailExists) {
      return options.handleEmailExists(e)
    } else {
      throw new Error(`Error: 'handleEmailExists()' method does not exist!`)
    }
  }


  return (
    <>
      <div 
        style={ {
          ...cssStyle,
          padding: '18px',
          borderRadius: '1rem',
          margin: '0rem 0rem 2rem 0rem',
          boxShadow: '0px 2.5px 5px rgba(80, 110, 127, 0.5)',
        } }
      >
        <div style={ { padding: '8px' } }>
          <h2 style={ { textAlign: 'center' } }>{ title }</h2>
        </div>
        <div>
          <p style={ { textAlign: 'center' } }>{ description }</p>
        </div>
        <div
          style={ {
            ...definitelyCenteredStyle,
            margin: '18px 0px 12px 0px',
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
                <Link href={ href }>
                  <button className={ styles.button }>{ buttonText }</button>
                </Link>
              </>
            ) }
          </div>
        </div>
      </div>
    </>
  )
}

export default Card