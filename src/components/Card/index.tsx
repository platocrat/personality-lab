'use client';

// Externals
import { CSSProperties, FC, ReactNode } from 'react'
import Link from 'next/link'
// Locals
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/app/page.module.css'


type CardProps = {
  href: string
  title: string
  buttonText: string
  description: string | ReactNode
  content?: ReactNode
  cssStyle?: CSSProperties
  options?: {
    hasLink: boolean,
    buttonOnClick: (e: any) => void
  }
}


const Card: FC<CardProps> = ({
  href,
  title,
  content,
  options,
  cssStyle,
  buttonText,
  description,
}) => {
  return (
    <>
      <div 
        style={ {
          ...cssStyle,
          padding: '18px',
          borderRadius: '1.5rem',
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
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            { options?.hasLink ? (
              <>
                <button 
                  className={ styles.button }
                  onClick={ (e: any) => options?.buttonOnClick(e) }
                >
                  { buttonText }
                </button>
                { content }
              </>
            ) : (
              <>
                <Link href={ href }>
                  <button className={ styles.button }>{ buttonText }</button>
                </Link>
                { content }
              </>
            ) }
          </div>
        </div>
      </div>
    </>
  )
}

export default Card