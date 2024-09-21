// Externals
import { FC, useContext, useLayoutEffect } from 'react'
// Locals
import Consent from '@/sections/social-rating/session/consent'
import Results from '@/sections/social-rating/session/results'
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
} from '@/utils'



type InGameProps = {

}



// Page-global constants
const BESSI_VERSION = 20




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
    isUpdatingPlayers,
    // State setters
    setIsUpdatingPlayers,
    // State change function handlers
    haveAllPlayersCompletedConsentForm,
    haveAllPlayersCompletedSelfReport,
    haveAllPlayersCompletedObserverReport,
  } = useContext<GameSessionContextType>(GameSessionContext)


  // -------------------------- `onSubmit` handlers ----------------------------
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
        // Update the player's `inGameState` in DynamoDB
        await updatePlayers(storedNickname)
        // Update the local cache of `player` state
        updatePlayerInLocalStorage(updatedPlayer)
      }
    }
  }


  // --------------------------- Regular functions -----------------------------
  function createUpdatedPlayer(storedPlayer: string, phase: GamePhases): Player {
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
  async function updatePlayers(_nickname: string): Promise<void> {
    setIsUpdatingPlayers(true)

    const hasJoined = true
    const ipAddress = ''
    const inGameState: PlayerInGameState = {
      hasCompletedConsentForm: false,
      hasCompletedSelfReport: false,
      hasCompletedObserverReport: false,
    }
    const joinedAtTimestamp = 0

    const player: Player = {
      hasJoined,
      ipAddress,
      inGameState,
      joinedAtTimestamp,
    }

    const _players: SocialRatingGamePlayers = { [_nickname]: player }

    try {
      const apiEndpoint = `/api/v1/social-rating/game/update-players`
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          players: _players,
          isGameInSession,
        }),
      })

      const json = await response.json()

      if (response.status === 500) {
        setIsUpdatingPlayers(false)
        throw new Error(json.error)
      }

      if (response.status === 405) {
        setIsUpdatingPlayers(false)
        throw new Error(json.error)
      }

      if (response.status === 200) {
        const updatedPlayers = json.updatedPlayers as SocialRatingGamePlayers

        setPlayers(updatedPlayers)
        setIsUpdatingPlayers(false)
      } else {
        setIsUpdatingPlayers(false)

        const error = `Error posting new players to social rating game with session ID '${
          sessionId
        }' to DynamoDB: `

        throw new Error(`${error}: ${json.error}`)
      }
    } catch (error: any) {
      console.log(error)
      setIsUpdatingPlayers(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error updating player: `, error.message)
    }
  }


  // --------------------------- `useLayoutEffect`s ----------------------------
  useLayoutEffect(() => {
    if (players) {
      if (haveAllPlayersCompletedConsentForm(players)) {
        setPhase(GamePhases.SelfReport)
      }

      if (haveAllPlayersCompletedSelfReport(players)) {
        setPhase(GamePhases.ObserverReport)
      }

      if (haveAllPlayersCompletedObserverReport(players)) {
        setPhase(GamePhases.Results)
      }
    }
  }, [ players ])





  return (
    <>
      <div>
        { phase === GamePhases.ConsentForm && (
          <Consent onCompletion={ onCompletion }/>
        ) }

        { phase === GamePhases.SelfReport && (
          <BessiAssessmentSection
            reportType={ 'self-report' }
            bessiVersion={ BESSI_VERSION }
            onCompletion={ onCompletion }
          />
        ) }

        { phase === GamePhases.ObserverReport && (
          <BessiAssessmentSection
            reportType={ 'observer-report' }
            onCompletion={ onCompletion }
            bessiVersion={ BESSI_VERSION }
          />
        ) }

        { phase === GamePhases.Results && <Results /> }
      </div>
    </>
  )
}

export default InGame