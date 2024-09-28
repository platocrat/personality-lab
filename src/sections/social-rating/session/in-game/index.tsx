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
import SelfReportOrObserverReport from '@/sections/social-rating/session/self-report-or-observer-report'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
import {
  Player,
  GamePhases,
  PlayerInGameState,
  SocialRatingGamePlayers,
  haveAllPlayersCompleted,
} from '@/utils'



type InGameProps = {

}



// Page-global constants
const RECONNECT_INTERVAL = 3_000 // Try to reconnect every 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5 // Set a maximum number of attempts
/**
 * @dev Mapping of AWS WebSocket API URLs.
 * Note: 
 * - The `'http-only'` AWS WebSocket URL uses HTTP Integration Types for each 
 *   route:
 * 1. `$connect` - HTTP route
 * 2. `$disconnect` - HTTP route
 * 3. `$default` - HTTP route
 * 4. `updatePlayer` - HTTP route
 */
const WEB_SOCKET_URLS = {
  local: 'wss://localhost:3000/api/v1/social-rating/game/wss/local',
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
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ socket, setSocket ] = useState<WebSocket | null>(null)
  const [ isReconnecting, setIsReconnecting ] = useState<boolean>(false)
  const [ reconnectAttempts, setReconnectAttempts ] = useState<number>(0)


  // --------------------------- Regular functions -----------------------------
  // Function to initialize WebSocket
  function initializeWebSocket() {
    const ws = new WebSocket(WEB_SOCKET_URLS['http-only'])

    ws.onopen = (event) => {
      console.log('Connected to AWS WebSocket!')
      setSocket(ws)
      setReconnectAttempts(0) // Reset the reconnection attempts once connected
    }

    ws.onmessage = (event) => {
      console.log(`WebSocket event: `, event)
      const data = JSON.parse(event.data)
      console.log(`WebSocket data: `, data)

      if (data.updatedPlayers) {
        setPlayers(data.updatedPlayers)
      }

      if (data.newPhase) {
        setPhase(data.newPhase)
      }
    }

    ws.onclose = () => {
      console.log('AWS WebSocket connection closed!')

      // Only attempt to reconnect if we haven't reached the max attempts
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        attemptReconnection()
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


  // Sends a message with the `updatePlayer` action through the AWS WebSocket
  function updatePlayer(
    playerData: { 
      players: SocialRatingGamePlayers, 
      sessionId: string, 
      isGameInSession: boolean 
    }
  ) {
    if (socket) {
      const data = {
        action: 'updatePlayer',
        players: playerData.players,
        sessionId: playerData.sessionId,
        isGameInSession: playerData.isGameInSession,
      }
      const dataAsString = JSON.stringify(data)
      // Send data to WebSocket
      socket.send(dataAsString)
    }
  }


  function createUpdatedPlayer(
    storedPlayer: string, 
    phase: GamePhases,
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
        setIsUpdatingGameState(true)

        const updatedPlayer = createUpdatedPlayer(storedPlayer, phase)

        // Add updated player to pre-existing mapping of players
        const updatedPlayers: SocialRatingGamePlayers = {
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

        setIsUpdatingGameState(false)
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
  /**
   * @dev Get survey results to calculate profile correlations
   * @returns 
   */
  async function getResults() {
    
  }

  
  // --------------------------- `useLayoutEffect`s ----------------------------
  useLayoutEffect(() => {
    // const storedPlayer = localStorage.getItem('player')
    // console.log(`storedPlayer: `, storedPlayer)
    // localStorage.clear()

    initializeWebSocket()

    return () => {
      if (socket) socket.close()
    }
  }, [ ])





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
          <SelfReportOrObserverReport onCompletion={ onCompletion } />
        ) }

        { phase === GamePhases.Results && <Results /> }
      </div>
    </>
  )
}

export default InGame