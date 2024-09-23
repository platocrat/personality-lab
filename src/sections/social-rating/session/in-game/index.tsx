// Externals
import { FC, useContext, useLayoutEffect, useMemo } from 'react'
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


type PhaseChecks = {
  phase: GamePhases
  check: 'hasCompletedConsentForm' |
  'hasCompletedSelfReport' |
  'hasCompletedObserverReport'
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
    isUpdatingGameState,
    // State setters
    setIsUpdatingGameState,
    // State change function handlers
    haveAllPlayersCompleted,
  } = useContext<GameSessionContextType>(GameSessionContext)


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
  // ~~~~~~ `onSubmit` handlers ~~~~~~
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
        await updatePlayers(storedNickname, updatedPlayer)
        // Update the local cache of `player` state
        updatePlayerInLocalStorage(updatedPlayer)
      }
    }
  }


  // ~~~~~~ API calls ~~~~~~
  async function updatePlayers(
    _nickname: string, 
    _updatedPlayer: Player,
  ): Promise<void> {
    setIsUpdatingGameState(true)

    const _players: SocialRatingGamePlayers = { [_nickname]: _updatedPlayer }

    try {
      const apiEndpoint = `/api/v1/social-rating/game/players`
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
        setIsUpdatingGameState(false)
        throw new Error(json.error)
      }

      if (response.status === 405) {
        setIsUpdatingGameState(false)
        throw new Error(json.error)
      }

      if (response.status === 200) {
        const updatedPlayers = json.updatedPlayers as SocialRatingGamePlayers

        setPlayers(updatedPlayers)
        setIsUpdatingGameState(false)
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

        const error = `Error posting new players to social rating game with session ID '${sessionId
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


  // --------------------------- `useLayoutEffect`s ----------------------------
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