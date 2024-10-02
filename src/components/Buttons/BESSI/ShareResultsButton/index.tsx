'use client'

// Externals
import Image from 'next/image'
import { useContext, useMemo, useState } from 'react'
// Locals
import { CSCrypto, imgPaths } from '@/utils'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Types
import { BessiSkillScoresContextType, SessionContextType } from '@/contexts/types'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import { SessionContext } from '@/contexts/SessionContext'



const BessiShareResultsButton = ({ }) => {
  // Contexts
  const { 
    bessiSkillScores 
  } = useContext<BessiSkillScoresContextType>(BessiSkillScoresContext)
  const { email } = useContext<SessionContextType>(SessionContext)
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
    if (window !== undefined) {
      let fullUrl = ''

      const timeout = 2_000
      const origin = window.location.origin
      const baseUrl = `${origin}/bessi/assessment`

      // Use client-side crypto class to encrypt and encode the concatenated 
      // identifiers that will be used in the shareable URL.
      const { encryptCompressEncode } = CSCrypto
      
      // Encrypted and encoded concatenated string of `id` and `accessToken`
      if (studyId) {
        const shareableId = `${id}--${accessToken}--${email}--${studyId}`
        const eeShareableId = await encryptCompressEncode(shareableId)
        fullUrl = `${baseUrl}/results/${eeShareableId}`
      } else {
        const shareableId = `${id}--${accessToken}--${email}`
        const eeShareableId = await encryptCompressEncode(shareableId)
        fullUrl = `${baseUrl}/results/${eeShareableId}`
      }


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
                alt='White checkmark'
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
                  alt='Share icon'
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