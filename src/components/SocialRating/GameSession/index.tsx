// Externals
import { FC, ReactNode, useContext, useEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import Results from '@/components/SocialRating/GameSession/Results'
import SelfReport from '@/components/SocialRating/GameSession/SelfReport'
import ObserverReport from '@/components/SocialRating/GameSession/ObserverReport'
import InvitationDetails from '@/components/SocialRating/GameSession/InvitationDetails'
// Contexts
import { GameSessionContext } from '@/components/Layouts/GameSessionLayout'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
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
    sessionId,
    sessionPin,
    sessionQrCode,
    setGameId,
    setSessionId,
    setSessionPin,
    setSessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // State to manage game phases
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


  // ---------------------------- `useEffect`s ---------------------------------
  useEffect(() => {
    if (phase === GamePhases.Results) {
      computeResults()
    }
  }, [phase])


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = window.location.origin

      if (event.origin !== origin) {
        console.warn('Origin not allowed:', event.origin)
        return
      }
      
      if (typeof event.data !== 'string') {
        // console.log(`Invalid message source: `, event.data.source)
      } else {
        const eventDataParsed = JSON.parse(event.data)

        if (eventDataParsed.source !== 'personality-lab--social-rating-game') {
          // console.log(`Invalid message source: `, eventDataParsed)
        }  else {
          const {
            gameId,
            sessionId,
            sessionPin,
            sessionQrCode,
          } = eventDataParsed

          // Validate data
          if (
            typeof gameId === 'string' &&
            typeof sessionId === 'string' &&
            typeof sessionPin === 'string' &&
            typeof sessionQrCode === 'string'
          ) {
            // Update the context
            setGameId?.(gameId)
            setSessionId?.(sessionId)
            setSessionPin?.(sessionPin)
            setSessionQrCode?.(sessionQrCode)

            // Send acknowledgment back to the opener
            window.opener.postMessage('acknowledged', origin)
          } else {
            console.error('Received invalid data format!')
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [ 
    gameId, 
    sessionId, 
    sessionPin,
    sessionQrCode,
  ])


  // Check if session data is available
  useEffect(() => {
    if (!sessionId) {
      // Optionally, redirect or show a loading state until session data is 
      // available
      console.log('Waiting for session data...')
    } else {
      // Session data is available proceed with game logic
      console.log(
        'Session data received:', 
        {
          gameId, 
          sessionId, 
          sessionPin, 
          sessionQrCode 
        }
      )
    }
  }, [ sessionId ])


  
  
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