// Externals
import {
  FC,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import Consent from '@/sections/social-rating/session/consent'
import Results from '@/sections/social-rating/session/results'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
import {
  GamePhases,
  Player,
  PlayerInGameState,
  SocialRatingGamePlayers
} from '@/utils'



type InGameProps = {

}


type PhaseChecks = {
  phase: GamePhases
  check: 'hasCompletedConsentForm' |
  'hasCompletedSelfReport' |
  'hasCompletedObserverReport'
}




// Page-global constants
const BESSI_VERSION = 20
const RECONNECT_INTERVAL = 3_000 // Try to reconnect every 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5 // Set a maximum number of attempts
/**
 * @dev Mapping of AWS WebSocket API URLs.
 * Note: 
 * - The `'mock-routes'` AWS WebSocket URL uses Mock Integration Types for all
 * routes except for the custom route(s):
 * 1. `$connect` - Mock route
 * 2. `$disconnect` - Mock route
 * 3. `$default` - Mock route
 * 4. `updatePlayer` - HTTP route
 * - The `'http-only'` AWS WebSocket URL uses HTTP Integration Types only for
 * each route:
 * 1. `$connect` - HTTP route
 * 2. `$disconnect` - HTTP route
 * 3. `$default` - HTTP route
 * 4. `updatePlayer` - HTTP route
 */
const WEB_SOCKET_URLS = {
  'mock-routes': 'wss://p43nv4mq12.execute-api.us-east-1.amazonaws.com/production/',
  'http-only': 'wss://vpfscho95i.execute-api.us-east-1.amazonaws.com/production/'
}


const InGame: FC<InGameProps> = ({

}) => {
  // Contexts
  const {
    // State values
    phase,
    players,
    setPhase,
    sessionId,
    setPlayers,
    isGameInSession,
    isUpdatingGameState,
    // State setters
    setIsUpdatingGameState,
    // State change function handlers
    haveAllPlayersCompleted,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ socket, setSocket ] = useState<WebSocket | null>(null)
  const [ isReconnecting, setIsReconnecting ] = useState<boolean>(false)
  const [ reconnectAttempts, setReconnectAttempts ] = useState<number>(0)

  // --------------------------- Memoized constants ----------------------------
  const reportType = useMemo((): 'self-report' | 'observer-report' => {
    let reportType: 'self-report' | 'observer-report' = 'self-report'

    if (phase === GamePhases.SelfReport) {
      reportType = 'self-report'
    } else if (phase === GamePhases.ObserverReport) {
      reportType = 'observer-report'
    } else {
      reportType = 'self-report'
    }

    return reportType
  }, [ phase ])


  // --------------------------- Regular functions -----------------------------
  // Function to initialize WebSocket
  function initializeWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_URLS['http-only'])

    ws.onopen = () => {
      console.log('Connected to AWS WebSocket!')
      setSocket(ws)
      setReconnectAttempts(0) // Reset the reconnection attempts once connected
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.updatedPlayers) {
        setPlayers(data.updatedPlayers)
      }

      if (data.newPhase) {
        setPhase(data.newPhase)
      }
    }

    if (ws.OPEN && !ws.CLOSED && !ws.CLOSING && !ws.CONNECTING) {
      ws.onclose = () => {
        console.log('AWS WebSocket connection closed!')

        // Only attempt to reconnect if we haven't reached the max attempts
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          attemptReconnection()
        }
      }
    }

    ws.onerror = (error) => {
      console.error('AWS WebSocket error: ', error)
      ws.close()
    }
  }

  // Function to handle reconnection attempts
  function attemptReconnection() {
    if (!isReconnecting) {
      setIsReconnecting(true)

      // Reattempt connection every RECONNECT_INTERVAL milliseconds
      const reconnectionInterval = setInterval(() => {
        setReconnectAttempts((prev) => {
          if (prev >= MAX_RECONNECT_ATTEMPTS) {
            clearInterval(reconnectionInterval) // Stop trying after max attempts
            setIsReconnecting(false)
            console.error('Max reconnection attempts reached')
            return prev
          }

          console.log(`Reconnection attempt #${prev + 1}`)
          initializeWebSocket() // Attempt to reconnect

          return prev + 1
        })
      }, RECONNECT_INTERVAL)
    }
  }


  function updatePlayer(
    playerData: { 
      players: SocialRatingGamePlayers, 
      sessionId: string, 
      isGameInSession: boolean 
    }
  ) {
    if (socket) {
      // Send data to WebSocket
      socket.send(JSON.stringify({
        action: 'updatePlayer',
        players: playerData.players,
        sessionId: playerData.sessionId,
        isGameInSession: playerData.isGameInSession,
      }))
    }
  }


  function createUpdatedPlayer(
    storedPlayer: string, 
    phase: GamePhases
  ): Player {
    const player = JSON.parse(storedPlayer) as Player
    const previousInGameState = { ...player.inGameState }

    let updatedInGameState: PlayerInGameState

    // Update the appropriate inGameState based on the current game phase
    switch (phase) {
      case GamePhases.ConsentForm:
        updatedInGameState = {
          ...previousInGameState,
          hasCompletedConsentForm: true, // Mark consent form as completed
        }
        break

      case GamePhases.SelfReport:
        updatedInGameState = {
          ...previousInGameState,
          hasCompletedSelfReport: true, // Mark self-report as completed
        }
        break

      case GamePhases.ObserverReport:
        updatedInGameState = {
          ...previousInGameState,
          hasCompletedObserverReport: true, // Mark observer report as completed
        }
        break

      default:
        updatedInGameState = previousInGameState // No updates in other phases
    }

    const updatedPlayer: Player = {
      ...player,
      inGameState: updatedInGameState,
    }

    return updatedPlayer
  }


  // Cache updated player in local storage
  function updatePlayerInLocalStorage(updatedPlayer: Player): void {
    const key = 'player'
    const value = JSON.stringify(updatedPlayer)
    localStorage.setItem(key, value)
  }


  // ---------------------------- Async functions ------------------------------
  // ~~~~~~ Handles what happens after results data is stored in DynamoDB ~~~~~~
  /**
   * @dev Make sure to collect `'self-report'` or `'observer-report'` data 
   * within the
   * ```typescript
   * await storeInDynamoDB()
   * ```
   * function, which is found in the `BessiAssessmentSection` function 
   * component.
   */
  const onCompletion = async (): Promise<void> => {
    if (players) {
      // Check if stored nickname and stored player is in local storage
      const storedNickname = localStorage.getItem('nickname')
      const storedPlayer = localStorage.getItem('player')

      if (storedNickname && storedPlayer) {
        const updatedPlayer = createUpdatedPlayer(storedPlayer, phase)

        // Add updated player to pre-existing mapping of players
        const updatedPlayers = {
          ...players,
          [ storedNickname ]: updatedPlayer
        }
        
        // Send data to update the player state via WebSocket
        updatePlayer({
          players: updatedPlayers,
          sessionId,
          isGameInSession
        })

        // Update the local cache of `player` state
        updatePlayerInLocalStorage(updatedPlayer)
      }
    }
  }


  async function calculateProfileCorrelations() {
    if (haveAllPlayersCompleted(players, 'hasCompletedObserverReport')) {
      const results = await getResults()


    } else {

    }
  }


  // ~~~~~~ API calls ~~~~~~
  async function updateGamePhase(_phase: GamePhases): Promise<GamePhases> {
    setIsUpdatingGameState(true)

    try {
      const apiEndpoint = `/api/v1/social-rating/game/game-phase`
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          phase: _phase,
        }),
      })

      const json = await response.json()

      if (response.status === 500) {
        setIsUpdatingGameState(false)
        throw new Error(json.error)
      }

      if (response.status === 405) {
        setIsUpdatingGameState(false)
        throw new Error(json.error)
      }

      if (response.status === 200) {
        const phase_ = json.phase as GamePhases
        setIsUpdatingGameState(false)
        return phase_
      } else {
        setIsUpdatingGameState(false)

        const error = `Error posting new players to social rating game with session ID '${
          sessionId
        }' to DynamoDB: `

        throw new Error(`${error}: ${json.error}`)
      }
    } catch (error: any) {
      console.log(error)
      setIsUpdatingGameState(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error updating player: `, error.message)
    }
  }


  /**
   * @dev Get survey results to calculate profile correlations
   * @returns 
   */
  async function getResults() {
    
  }

  
  // --------------------------- `useLayoutEffect`s ----------------------------
  useLayoutEffect(() => {
    console.log(`storedPlayer: `, localStorage.getItem('player'))
    initializeWebSocket()

    return () => {
      if (socket) socket.close()
    }
  }, [ ])


  useLayoutEffect(() => {
    if (players) {
      const phaseChecks: PhaseChecks[] = [
        { check: 'hasCompletedConsentForm', phase: GamePhases.SelfReport },
        { check: 'hasCompletedSelfReport', phase: GamePhases.ObserverReport },
        { check: 'hasCompletedObserverReport', phase: GamePhases.Results }
      ]

      const nextPhase: GamePhases | undefined = phaseChecks.find(
        ({ check }): boolean => haveAllPlayersCompleted(players, check)
      )?.phase

      if (nextPhase) {
        updateGamePhase(nextPhase).then(
          (_phase: GamePhases): void => setPhase(_phase)
        )
      }
    }
  }, [ players ])







  return (
    <>
      <div>
        { phase === GamePhases.ConsentForm && (
          <Consent onCompletion={ onCompletion }/>
        ) }

        { (
          phase === GamePhases.SelfReport || 
          phase === GamePhases.ObserverReport
        ) && (
          <BessiAssessmentSection
            reportType={ reportType }
            bessiVersion={ BESSI_VERSION }
            onCompletion={ onCompletion }
          />
        ) }

        { phase === GamePhases.Results && <Results /> }
      </div>
    </>
  )
}

export default InGame