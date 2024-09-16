// Externals
import { 
  FC, 
  useState,
  useEffect, 
  ReactNode, 
  useContext, 
  useLayoutEffect, 
} from 'react'
import { usePathname } from 'next/navigation'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import Results from '@/components/SocialRating/GameSession/Results'
import SelfReport from '@/components/SocialRating/GameSession/SelfReport'
import ObserverReport from '@/components/SocialRating/GameSession/ObserverReport'
import InvitationDetails from '@/components/SocialRating/GameSession/InvitationDetails'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { SOCIAL_RATING_GAME__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import initiateGameStyles from '@/components/SocialRating/InitiateGame/InitiateGame.module.css'



type GameSessionProps = {
  isLobby: boolean
  children: ReactNode
}


enum GamePhases {
  SelfReport = 'self-report',
  ObserverReport = 'observer-report',
  Results = 'results',
}



const GameSession: FC<GameSessionProps> = ({
  isLobby,
  children,
  // sessionId,
}) => {
  // Contexts
  const {
    gameId,
    isHost,
    hostEmail,
    sessionId,
    sessionPin,
    sessionQrCode,
    // Setters
    setGameId,
    setHostEmail,
    setSessionId,
    setSessionPin,
    setSessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()
  // State to manage game phases
  const [ isFetchingGame, setIsFetchingGame ] = useState<boolean>(true)
  const [ phase, setPhase ] = useState<GamePhases>(GamePhases.SelfReport)


  // ------------------------- Regular functions -------------------------------
  // Functions to handle each phase
  const handleSelfReportCompletion = () => {
    // Collect self-report data
    // Move to observer-report phase
    setPhase(GamePhases.SelfReport)
  }
  
  const handleObserverReportCompletion = () => {
    // Collect observer-report data
    // Move to results phase
    setPhase(GamePhases.Results)
  }
  
  const computeResults = () => {
    // Compute profile correlations
    // Determine the winner
  }
  
  
  // --------------------------- Async functions -------------------------------
  async function getGame(): Promise<void> {
    setIsFetchingGame(true)

    try {
      const apiEndpoint = `/api/v1/social-rating/game?sessionId=${sessionId}`
      const response = await fetch(apiEndpoint, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 404) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const socialRatingGame = json.socialRatingGame as SOCIAL_RATING_GAME__DYNAMODB

      setGameId(socialRatingGame.gameId)
      setHostEmail(socialRatingGame.hostEmail)
      setSessionId(socialRatingGame.sessionId)
      setSessionPin(socialRatingGame.sessionPin)
      setSessionQrCode(socialRatingGame.sessionQrCode)

      setIsFetchingGame(false)
    } catch (error: any) {
      setIsFetchingGame(false)
      throw new Error(error.message)
    }
  }


  // ---------------------------- `useEffect`s ---------------------------------
  useEffect(() => {
    if (phase === GamePhases.Results) {
      computeResults()
    }
  }, [ phase ])


  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     const origin = window.location.origin

  //     if (event.origin !== origin) {
  //       console.warn('Origin not allowed:', event.origin)
  //       return
  //     }
      
  //     if (typeof event.data !== 'string') {
  //       // console.log(`Invalid message source: `, event.data.source)
  //     } else {
  //       const eventDataParsed = JSON.parse(event.data)

  //       if (eventDataParsed.source !== 'personality-lab--social-rating-game') {
  //         // console.log(`Invalid message source: `, eventDataParsed)
  //       }  else {
  //         const {
  //           gameId,
  //           sessionId,
  //           sessionPin,
  //           sessionQrCode,
  //         } = eventDataParsed

  //         // Validate data
  //         if (
  //           typeof gameId === 'string' &&
  //           typeof sessionId === 'string' &&
  //           typeof sessionPin === 'string' &&
  //           typeof sessionQrCode === 'string'
  //         ) {
  //           // Update the context
  //           setGameId?.(gameId)
  //           setSessionId?.(sessionId)
  //           setSessionPin?.(sessionPin)
  //           setSessionQrCode?.(sessionQrCode)

  //           // Send acknowledgment back to the opener
  //           window.opener.postMessage('acknowledged', origin)
  //         } else {
  //           console.error('Received invalid data format!')
  //         }
  //       }
  //     }
  //   }

  //   window.addEventListener('message', handleMessage)

  //   return () => {
  //     window.removeEventListener('message', handleMessage)
  //   }
  // }, [ 
  //   gameId, 
  //   sessionId, 
  //   sessionPin,
  //   sessionQrCode,
  // ])


  // ----------------------------`useLayoutEffect`s ----------------------------
  // Check if session data is available
  useLayoutEffect(() => {
    const targetIndex = '/social-rating/session/'.length
    const sessionId_ = pathname.slice(targetIndex)
    setSessionId(sessionId_)
  }, [ ])


  // Get the rest of game session details from `sessionId`
  useLayoutEffect(() => {
    if (sessionId) {
      const requests = [
        getGame(),
      ]
      
      Promise.all(requests).then(() => { })
    }
  }, [ sessionId ])


  
  
  return (
    <>
      <div style={{ ...definitelyCenteredStyle }}>
        { sessionId ? (
          <div>
            {/* ------------------ Game invite details -------------------- */ }
            { isLobby && <InvitationDetails isLobby={ isLobby } /> }

            {/* --------------- Render other game components -------------- */ }
            
            {/* --------------------- Game content ------------------------ */ }
            { children }
            <div>
              { phase === GamePhases.SelfReport && (
                <SelfReport 
                  onCompletion={ handleSelfReportCompletion } 
                />
              ) }
              
              { phase === GamePhases.ObserverReport && (
                <ObserverReport 
                  onCompletion={ handleObserverReportCompletion } 
                />
              ) }
              
              { phase === GamePhases.Results && <Results /> }
            </div>
          </div>
        ) : (
          <>
            {/* Suspense */}
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                // top: '80px',
              } }
            >
              <Spinner height='40' width='40' />
            </div>
          </>
        ) }
      </div>
    </>
  )
}


export default GameSession