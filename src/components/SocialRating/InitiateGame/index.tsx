'use client'

// Externals
import QRCode from 'qrcode'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FC, useContext, useMemo, useState } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import pageStyles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'
import styles from '@/components/SocialRating/InitiateGame/InitiateGame.module.css'



type InitiateGameProps = {
}



const InitiateGame: FC<InitiateGameProps> = ({ }) => {
  // Contexts
  const {
    sessionId,
    sessionPin,
    sessionQrCode,
    setSessionId, 
    setSessionPin, 
    setSessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()

  const hostButtonText = `Host`
  const startButtonText = `Start`
  const pagePath = `${pathname}/session`

  // States
  const [ href, setHref ] = useState<string>(pagePath)
  // Booleans
  const [ isHosting, setIsHosting ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  
  // ------------------------------- Regular functions -------------------------
  // Generate a random session pin
  function generateSessionPin(): string {
    return Math.floor(10000 + Math.random() * 90000).toString() // 5-digit pin
  }

  // Generate a unique session ID
  function generateSessionId(): string {
    return crypto.randomUUID()
  }

  // Generate a QR code for the session
  async function generateSessionQrCode(sessionId: string) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(`${href}/${sessionId}`)
      return qrCodeUrl
    } catch (error: any) {
      console.error(error)
    }
  }

  // ------------------------------- Async functions ---------------------------
  // Handle host commitment
  async function handleOnHostCommitment(e: any): Promise<void> {
    const sessionId = generateSessionId()
    const sessionPin = generateSessionPin()
    const sessionQrCode = await generateSessionQrCode(sessionId)

    setSessionId ? setSessionId(sessionId) : null
    setSessionPin ? setSessionPin(sessionPin) : null
    setSessionQrCode ? setSessionQrCode(sessionQrCode || '') : null

    setIsHosting(true)

    // Update the href dynamically with the sessionId
    setHref(`${href}/${sessionId}`)
  }
  
  
  // Handle game initiation
  async function handleOnGameInitiation(e: any): Promise<void> {
    setIsLoading(true)

    // Navigate to the next page (you can use Next.js router or ProgressBarLink)
    // For now, I'm assuming ProgressBarLink will handle the navigation
  }


  

  return (
    <>
      <div>
        <div className={ styles.buttonContainer }>
          {/* Host commits to a game session */}
          { isHosting ? (
            <>
              <div style={{ ...definitelyCenteredStyle }}>
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ margin: '0px 0px 22px 0px' }}>
                    { `Hosting a new game session with:` }
                  </div>
                  <div style={ { color: 'rgb(0, 90, 194)' }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div>
                        { `Session ID:` }
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        { `${sessionId}` }
                      </div>
                    </div>
                    <div style={ { display: 'grid', gap: '8px', marginTop: '8px' } }>
                      <div>
                        { `Session Pin:` }
                      </div>
                      <div style={ { textAlign: 'center' } }>
                        { `${sessionPin}` }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                style={{ 
                  ...definitelyCenteredStyle,
                  flexDirection: 'row',
                }}
              >
                { sessionQrCode && (
                  <div>
                    <Image
                      width={ 144 }
                      height={ 144 }
                      style={{ borderRadius: '12px' }}
                      src={ sessionQrCode }
                      alt='QR Code'
                    />
                  </div>
                ) }
              </div>
            </>
          ) : (
            <>
              <button
                style={ { margin: '0px' } }
                className={ pageStyles['generate-button'] }
                onClick={ (e: any): Promise<void> => handleOnHostCommitment(e) }
              >
                { hostButtonText }
              </button>
            </>
          )}
          
          {/* Host starts the game session */}
          <ProgressBarLink href={ href }>
            <button
              className={ pageStyles['generate-button'] }
              onClick={ (e: any): Promise<void> => handleOnGameInitiation(e) }
              disabled={ isHosting ? false : true }
              style={{
                margin: '0px',
                cursor: isHosting ? 'pointer' : 'not-allowed',
                backgroundColor: isHosting ? '' : 'gray',
              }}
            >
              { startButtonText }
            </button>
          </ProgressBarLink>
        </div>
      </div>
    </>
  )
}


export default InitiateGame