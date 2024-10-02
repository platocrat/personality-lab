'use client'

// Externals
import {
  FC,
  useState,
  Dispatch,
  useEffect,
  useContext,
  SetStateAction,
  useLayoutEffect,
} from 'react'
import QRCode from 'qrcode'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Utils
import { 
  Player,
  GamePhases,
  PlayerInGameState,
  ProfileCorrelations,
  handleEnterGameSession,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'
// CSS
import styles from '@/sections/social-rating/session/initiate-game/InitiateGame.module.css'
import fictionalCharactersStyles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



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
    sessionId,
    sessionPin,
    sessionQrCode,
    isGameSession,
    gameSessionUrlSlug,
    // Setters
    setGameId,
    setSessionId, 
    setSessionPin, 
    setSessionQrCode,
    setGameSessionUrlSlug,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ isCreatingGame, setIsCreatingGame ] = useState<boolean>(false)
  const [ showHostButton, setShowHostButton ] = useState<boolean>(true)

  const hostButtonText = `Host`
  
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
  async function generateSessionQrCode(
    _url: string,
    _sessionId: string,
    _sessionPin: string,
  ): Promise<string> {
    try {
      const queryParameter = `?from=qr`

      const secureToken = await getSecureToken(_sessionId, _sessionPin)
      const qrCodeUrl = await QRCode.toDataURL(
        `${_url}${queryParameter}&token=${secureToken}`
      )

      return qrCodeUrl
    } catch (error: any) {
      console.error(error)
      throw new Error(error)
    }
  }


  // Handle host commitment
  async function onHostCommitment(): Promise<void> {
    if (window !== undefined) {
      const origin = window.location.origin
      
      const sessionId = generateSessionId()
      const sessionPin = generateSessionPin()

      // Update the URL dynamically with the sessionId
      const longUrl = `${origin}/social-rating/session/${sessionId}`
      const sessionQrCode = await generateSessionQrCode(
        longUrl,
        sessionId,
        sessionPin,
      ) ?? ''

      setSessionQrCode(sessionQrCode)
      
      // Call the API to shorten the URL for everything else
      try {
        const response = await fetch('/api/url/shorten', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            originalUrl: longUrl
          }),
        })

        const { shortenedUrl } = await response.json()

        if (shortenedUrl) {
          const target = 'api/url/'
          const targetIndex = shortenedUrl.indexOf(target) + target.length
          const shortId = shortenedUrl.slice(targetIndex)
          const gameSessionUrlSlug_ = target + shortId

          setGameSessionUrlSlug(gameSessionUrlSlug_)
        }
      } catch (error: any) {
        throw new Error('Error shortening the URL: ', error)
      }

      setSessionId(sessionId)
      setSessionPin(sessionPin)
    }
  }
  

  async function handleOnGameInitiation(e: any): Promise<void> {
    if (window !== undefined) {
      e.preventDefault()

      setIsLoading(true)

      const successMessage = await storeGameInDynamoDB()
      
      const origin = window.location.origin
      const gameSessionUrl = `${origin}/${gameSessionUrlSlug}`

      await handleEnterGameSession(gameSessionUrl)
      
      setShowHostButton(false)
      setIsHosting(true)
      setIsLoading(false)
    }
  }


  /**
   * @dev Gets a secure token for the game session to be used to validate the
   *      QR code when a user uses it to navigate to the game session's page.
   * @returns secureToken
   */
  async function getSecureToken(
    _sessionId: string,
    _sessionPin: string,
  ): Promise<string> {
    try {
      const apiEndpoint = `/api/v1/social-rating/secure-token?sessionPin=${
        _sessionPin
      }&sessionId=${ _sessionId }`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()

      if (response.status === 200) {
        const secureToken: string = json.secureToken
        return secureToken
      } else {
        /**
         * @todo Handle error UI here
         */
        throw new Error(json.error)
      }
    } catch (error: any) {
      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error getting secure token: `, error)

    }
  }


  // Creates a new game and stores the initial game state in DynamoDB
  async function storeGameInDynamoDB(): Promise<void> {
    setIsCreatingGame(true)

    const isActive = true
    const hostEmail = email ?? ''
    const isGameInSession = false
    const phase = GamePhases.Lobby

    const nickname = 'host'

    const hasJoined = true
    const ipAddress = ''
    const joinedAtTimestamp = 0
    const profileCorrelations: ProfileCorrelations = { }

    const inGameState: PlayerInGameState = {
      hasCompletedConsentForm: false,
      hasCompletedSelfReport: false,
      hasCompletedObserverReport: false,
      profileCorrelations,
    }
    
    const player = {
      hasJoined,
      ipAddress,
      inGameState,
      joinedAtTimestamp,
    } as Player
    
    const players = { [ nickname ]: player }

    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    const socialRatingGame: Omit<
      SOCIAL_RATING_GAME__DYNAMODB, 
      'id' | 'createdAtTimestamp' | 'updatedAtTimestamp'
    > = {
      phase,
      gameId,
      players,
      isActive,
      hostEmail,
      sessionId,
      sessionPin,
      sessionQrCode,
      isGameInSession,
      gameSessionUrlSlug,
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

        const error = `Error putting new social rating game with session ID '${
          sessionId
        }' to DynamoDB: `

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


  /**
   * @todo Delete uncomment the code block below once we add more social rating 
   *       games.
   */
  // useEffect(() => {
  //   if (gameId) {
  //     const requests = [
  //       onHostCommitment(),
  //     ]

  //     Promise.all(requests).then(() => {})
  //   }
  // }, [ gameId ])


  /**
   * @todo Delete the code block of `useLayoutEffect`s below once we add more 
   *       social rating games.
   */
  // ------------------------ `useLayoutEffect`s -------------------------------
  useLayoutEffect(() => {
    setGameId('bessi')
  }, [ ])


  

  return (
    <>
      <div>
        <div className={ styles.buttonContainer }>
          {/* Host starts the game session */}
          <NetworkRequestSuspense
            isLoading={ isLoading }
            spinnerOptions={ { 
              showSpinner: true,
              height: '30',
              width: '30',
              containerStyle: {
                top: '0px',
              }
            } }
          >
            { showHostButton && (
              <button
                disabled={ gameId ? false : true }
                className={ fictionalCharactersStyles['generate-button'] }
                onClick={ (e: any): Promise<void> => handleOnGameInitiation(e) }
                style={ {
                  margin: '0px',
                  width: '125px',
                  cursor: gameId ? 'pointer' : 'not-allowed',
                  backgroundColor: gameId ? '' : 'gray',
                } }
              >
                { hostButtonText }
              </button>
            ) }
          </NetworkRequestSuspense>
        </div>
      </div>
    </>
  )
}


export default InitiateGame