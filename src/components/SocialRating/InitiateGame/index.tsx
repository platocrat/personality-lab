'use client'

// Externals
import { 
  FC, 
  useMemo, 
  useState,
  Dispatch, 
  useContext, 
  SetStateAction,
} from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
import InvitationDetails from '@/components/SocialRating/GameSession/InvitationDetails'
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/components/Layouts/GameSessionLayout'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/SocialRating/InitiateGame/InitiateGame.module.css'
import pageStyles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



type InitiateGameProps = {
  isHosting: boolean
  setIsHosting: Dispatch<SetStateAction<boolean>>
}



const isLobby = false



const InitiateGame: FC<InitiateGameProps> = ({
  isHosting,
  setIsHosting,
}) => {
  // Contexts
  const {
    gameId,
    sessionId,
    sessionPin,
    sessionQrCode,
    setGameId,
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

  // ------------------------------- Async functions ---------------------------
  // Generate a QR code for the session
  async function generateSessionQrCode(sessionId: string) {
    try {
      const qrCodeUrl = await QRCode.toDataURL(`${href}/${sessionId}`)
      return qrCodeUrl
    } catch (error: any) {
      console.error(error)
    }
  }

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
  

  const handleOnGameInitiation = async (e: any): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const origin = window.location.origin
      const newWindow: any = window.open(href, '_blank', /* 'noopener,noreferrer' */)

      const source = 'personality-lab--social-rating-game'

      const data = {
        source,
        gameId,
        sessionId,
        sessionPin,
        sessionQrCode,
      }

      // Convert data object to a string
      const message = JSON.stringify(data)

      const sendMessage = () => {
        if (
          origin === 'https://localhost:3000' || 
          origin === 'https://canpersonalitychange.com' &&
          pathname === '/social-rating'
        ) {
          newWindow.postMessage(message, origin)
        } else {
          throw new Error(
            `Invalid origin and pathname! Cannot send messages from this origin and pathname.`
          )
        }

      }

      const timeout = 500 // 500 milliseconds

      // Use an interval to keep trying to send the message until it's received
      const messageInterval = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(messageInterval)
          return
        }

        sendMessage()
      }, timeout)

      // Listen for acknowledgment
      const receiveAck = (event: MessageEvent) => {
        if (event.origin !== origin) {
          return
        }

        // Clear the interval once the new window acknowledges receipt
        if (event.data === 'acknowledged') {
          clearInterval(messageInterval)
          window.removeEventListener('message', receiveAck)
        }
      }

      window.addEventListener('message', receiveAck)
    } catch (error: any) {
      console.error('Failed to open the new window: ', error)
    }

    setIsLoading(false)
  }


  

  return (
    <>
      <div>
        { !isHosting && gameId && (
          <>
            <div style={ { textAlign: 'center', marginBottom: '24px' } }>
              { `Click "Host" to initiate the game you have selected` }
            </div>
          </>
        ) }

        <div className={ styles.buttonContainer }>
          {/* Host commits to a game session */}
          { isHosting && gameId !== null ? (
            <>
              <InvitationDetails isLobby={ isLobby } />
            </>
          ) : (
            <>
              { gameId && (
                <button
                  style={ { margin: '0px' } }
                  className={ pageStyles['generate-button'] }
                  onClick={ (e: any): Promise<void> => handleOnHostCommitment(e) }
                >
                  { hostButtonText }
                </button>
              ) }
            </>
          )}
          
          {/* Host starts the game session */}
          <button
            disabled={ isHosting ? false : true }
            className={ pageStyles['generate-button'] }
            onClick={ (e: any): Promise<void> => handleOnGameInitiation(e) }
            style={{
              margin: '0px',
              cursor: isHosting ? 'pointer' : 'not-allowed',
              backgroundColor: isHosting ? '' : 'gray',
            }}
          >
            { startButtonText }
          </button>
        </div>
      </div>
    </>
  )
}


export default InitiateGame