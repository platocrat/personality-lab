'use client'

// Externals
import { useContext, useMemo, useState } from 'react'
// Locals
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Types
import { BessiSkillScoresContextType } from '../../../../sections/assessments/bessi/assessment/results/bessi-results-visualization'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'




const BessiShareResultsButton = ({ }) => {
  // Contexts
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  const [ buttonText, setButtonText ] = useState('Share Results')

  
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

      setButtonText('Copied URL!')

      // Optionally reset the button text after a delay
      setTimeout(() => {
        setButtonText('Share Results')
      }, timeout)
    } catch (error) {
      // Handle potential errors, e.g., Clipboard API not available
      console.error('Failed to copy URL:', error)
      setButtonText('Failed to copy, try again')
      
      setTimeout(() => {
        setButtonText('Share Results')
      }, timeout)
    }
  }

  
  
  return (
    <>
      <div 
        style={ { 
          ...definitelyCenteredStyle,
          marginTop: '24px'
        } }
      >
        <button
          style={{ width: '100px' }}
          className={ styles.button }
          onClick={ handleShareResults }
        >
          { buttonText }
        </button>
      </div>
    </>
  )
}

export default BessiShareResultsButton