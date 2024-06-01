'use client'

// Externals
import Image from 'next/image'
import { useContext, useMemo, useState } from 'react'
// Locals
import { imgPaths } from '@/utils'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Types
import { BessiSkillScoresContextType } from '@/contexts/types'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'




const BessiShareResultsButton = ({ }) => {
  // Contexts
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  // States
  const [isCopied, setIsCopied ] = useState(false)

  
  /**
   * @todo Encrypt the ID, access token, and study ID
   */
  const id = useMemo((): string | undefined => {
    return bessiSkillScores?.id
  }, [ bessiSkillScores ])
  const accessToken = useMemo((): string | undefined => {
    return bessiSkillScores?.accessToken
  }, [ bessiSkillScores ])
  const studyId = useMemo((): string | undefined => {
    return bessiSkillScores?.studyId
  }, [ bessiSkillScores ])

  /**
   * Handle sharing results by generating a URL with the access token.
   * Toggle visibility of the URL for copying.
   */
  async function handleShareResults() {
    const origin = window.location.origin

    const baseUrl = `${ origin }/bessi/assessment`
    // Using path segment instead of query
    const fullUrl = `${baseUrl}/results/${id}--${accessToken}--${studyId}`

    const timeout = 2_000
    try {
      await navigator.clipboard.writeText(fullUrl)

      setIsCopied(true)

      // Optionally reset the button text after a delay
      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    } catch (error: any) {
      // Handle potential errors, e.g., Clipboard API not available
      throw new Error('Failed to copy URL:', error)
      setIsCopied(false)
      
      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    }
  }

  
  
  return (
    <>
      <div>
        { isCopied ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                borderRadius: `1rem`,
                borderWidth: `1.2px`,
                width: '40px',
                height: '32px',
                margin: '12px 0px',
                backgroundColor: 'rgb(18, 215, 67)'
              } }
            >
              <Image
                width={ 18 }
                height={ 18 }
                alt='Share icon to share data visualization'
                src={ `${imgPaths().svg}white-checkmark.svg` }
              />
            </div>
          </>
        ) : (
          <>
            <button
              className={ styles.button }
              onClick={ handleShareResults }
              style={ {
                height: '32px',
                padding: '0px 12px',
              } }
            >
              <div style={ definitelyCenteredStyle }>
                <Image
                  width={ 14 }
                  height={ 14 }
                  className={ styles.img }
                  onClick={ handleShareResults }
                  src={ `${imgPaths().svg}white-share.svg` }
                  alt='Share icon to share data visualization'
                />
              </div>
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default BessiShareResultsButton