'use client'

// Externals
import Image from 'next/image'
import { useContext, useMemo, useState } from 'react'
// Locals
import { imgPaths } from '@/utils'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Types
import { 
  BessiSkillScoresContextType 
} from '../../../../sections/assessments/bessi/assessment/results/bessi-results-visualization'
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
   * @todo Encrypt the ID and access token
   */
  const id = useMemo(() => {
    return bessiSkillScores?.id
  }, [bessiSkillScores])
  const accessToken = useMemo(() => {
    return bessiSkillScores?.accessToken
  }, [bessiSkillScores])


  /**
   * Handle sharing results by generating a URL with the access token.
   * Toggle visibility of the URL for copying.
   */
  async function handleShareResults() {
    const origin = window.location.origin

    const baseUrl = `${ origin }/bessi/assessment`
    // Using path segment instead of query
    const fullUrl = `${baseUrl}/results/${id}-${accessToken}`

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
        <button 
          className={ styles.button }
          onClick={ handleShareResults }
          style={{ 
            padding: '8px 12px',
            backgroundColor: isCopied ? 'rgb(18, 215, 67)' : ''
          }}
        >
          <Image
            width={ 18 }
            height={ 18 }
            alt='Share icon to share data visualization'
            className={ styles.img }
            onClick={ handleShareResults }
            src={ 
              isCopied 
                ? `${ imgPaths().svg }white-checkmark.svg` 
                : `${ imgPaths().svg }white-share.svg`
            }
          />
        </button>
      </div>
    </>
  )
}

export default BessiShareResultsButton