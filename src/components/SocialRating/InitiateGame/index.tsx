'use client'

// Externals
import {
  FC,
  useState,
  useEffect,
  Dispatch,
  useContext,
  SetStateAction,
} from 'react'
import QRCode from 'qrcode'
import { usePathname } from 'next/navigation'
// Locals
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Contexts
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Utils
import { SOCIAL_RATING_GAME__DYNAMODB } from '@/utils'
// CSS
import styles from '@/components/SocialRating/InitiateGame/InitiateGame.module.css'
import pageStyles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'
import ProgressBarLink from '@/components/Progress/ProgressBarLink'



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
    email,
  } = useContext<SessionContextType>(SessionContext)
  const {
    gameId,
    players,
    sessionId,
    sessionPin,
    sessionQrCode,
    isGameSession,
    setGameId,
    setSessionId, 
    setSessionPin, 
    setSessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()
  // States
  const [ isCreatingGame, setIsCreatingGame ] = useState<boolean>(false)

  const hostButtonText = `Host`
  const startButtonText = `Start`
  // const origin = window !== undefined ? window.location.origin : ''
  const origin = 'https://localhost:3000/'

  const pagePath = `${origin}${pathname}/session`

  // States
  const [ href, setHref ] = useState<string>(pagePath)
  // Booleans
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  
  // ------------------------------- Regular functions -------------------------
  // Generate a random session pin
  function generateSessionPin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString() // 5-digit pin
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
  async function onHostCommitment(): Promise<void> {
    const sessionId = generateSessionId()
    const sessionPin = generateSessionPin()
    const sessionQrCode = await generateSessionQrCode(sessionId) ?? ''

    setSessionId(sessionId)
    setSessionPin(sessionPin)
    setSessionQrCode(sessionQrCode)

    // Update the href dynamically with the sessionId
    setHref(`${href}/${sessionId}`)
  }
  

  const handleOnGameInitiation = async (e: any): Promise<void> => {
    e.preventDefault()

    setIsHosting(true)
    setIsLoading(true)

    const successMessage = await storeGameInDynamoDB()

    // try {
    //   const origin = window.location.origin
    //   const newWindow: any = window.open(href, '_blank', /* 'noopener,noreferrer' */)

    //   const source = 'personality-lab--social-rating-game'

    //   const data = {
    //     source,
    //     gameId,
    //     sessionId,
    //     sessionPin,
    //     sessionQrCode,
    //   }

    //   // Convert data object to a string
    //   const message = JSON.stringify(data)

    //   const sendMessage = () => {
    //     if (
    //       origin === 'https://localhost:3000' || 
    //       origin === 'https://canpersonalitychange.com' &&
    //       pathname === '/social-rating'
    //     ) {
    //       newWindow.postMessage(message, origin)
    //     } else {
    //       throw new Error(
    //         `Invalid origin and pathname! Cannot send messages from this origin and pathname.`
    //       )
    //     }
    //   }

    //   const timeout = 500 // 500 milliseconds

    //   // Use an interval to keep trying to send the message until it's received
    //   const messageInterval = setInterval(() => {
    //     if (newWindow.closed) {
    //       clearInterval(messageInterval)
    //       return
    //     }

    //     sendMessage()
    //   }, timeout)

    //   // Listen for acknowledgment
    //   const receiveAck = (event: MessageEvent) => {
    //     if (event.origin !== origin) {
    //       return
    //     }

    //     // Clear the interval once the new window acknowledges receipt
    //     if (event.data === 'acknowledged') {
    //       clearInterval(messageInterval)
    //       window.removeEventListener('message', receiveAck)
    //     }
    //   }

    //   window.addEventListener('message', receiveAck)
    // } catch (error: any) {
    //   console.error('Failed to open the new window: ', error)
    // }

    setIsLoading(false)
  }


  async function storeGameInDynamoDB() {
    setIsCreatingGame(true)

    const isActive = true
    const hostEmail = email ?? ''

    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    const socialRatingGame: Omit<
      SOCIAL_RATING_GAME__DYNAMODB, 
      "id" | "timestamp"
    > = {
      gameId,
      isActive,
      hostEmail,
      sessionId,
      sessionPin,
      sessionQrCode,
      players: players ?? [''],
    }

    try {
      const response = await fetch('/api/v1/social-rating/game', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          socialRatingGame,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        setIsCreatingGame(false)
        setIsLoading(false)
      } else {
        setIsCreatingGame(false)
        setIsLoading(false)

        const error = `Error putting new social rating game with session ID '${sessionId}' to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setIsCreatingGame(false)
      setIsLoading(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }
  

  // ---------------------------- `useEffect`s ---------------------------------
  useEffect(() => {
    if (gameId) {
      const requests = [
        onHostCommitment(),
      ]

      Promise.all(requests).then(() => {})
    }
  }, [ gameId ])

  

  return (
    <>
      <div>
        <div className={ styles.buttonContainer }>
          {/* Host starts the game session */}
          <ProgressBarLink href={ href }>
            <button
              disabled={ gameId ? false : true }
              className={ pageStyles['generate-button'] }
              onClick={ (e: any): Promise<void> => handleOnGameInitiation(e) }
              style={{
                margin: '0px',
                cursor: gameId ? 'pointer' : 'not-allowed',
                backgroundColor: gameId ? '' : 'gray',
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