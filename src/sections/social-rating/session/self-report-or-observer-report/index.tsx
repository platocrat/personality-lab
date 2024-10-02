// Externals
import { FC, useContext, useLayoutEffect, useMemo, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { GamePhases, Player } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css' 



type SelfReportOrObserverReportProps = {
  onCompletion: () => Promise<void>
}



const BESSI_VERSION = 20




const SelfReportOrObserverReport: FC<SelfReportOrObserverReportProps> = ({
  onCompletion,
}) => {
  // State values
  const {
    phase,
    players,
    isGameInSession,
    isUpdatingGameState,
  } = useContext<GameSessionContextType>(GameSessionContext)

  // States
  const [
    hasCompletedSelfReport,
    setHasCompletedSelfReport
  ] = useState<boolean>(false)
  const [
    hasCompletedObserverReport,
    setHasCompletedObserverReport
  ] = useState<boolean>(false)


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
  }, [phase])


  useLayoutEffect(() => {
    if (isGameInSession) {
      let hasCompletedSelfReport_ = false,
        hasCompletedObserverReport_ = false

      const storedPlayer = localStorage.getItem('player')

      if (storedPlayer) {
        const player = JSON.parse(storedPlayer) as Player

        hasCompletedSelfReport_ = player.inGameState.hasCompletedSelfReport
        hasCompletedObserverReport_ = player.inGameState.hasCompletedObserverReport

        setHasCompletedSelfReport(hasCompletedSelfReport_)
        setHasCompletedObserverReport(hasCompletedSelfReport_)
      }
    }
  }, [players])




  return (
    <>
      { isUpdatingGameState ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '50px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          { (
            phase === GamePhases.SelfReport || 
            phase === GamePhases.ObserverReport
          ) && (
            <>
              { (phase === GamePhases.SelfReport && hasCompletedSelfReport) ||
                (phase === GamePhases.ObserverReport && hasCompletedObserverReport) ? (
                <div className={ styles['player-nickname-grid'] }>
                  <h2 style={ { textAlign: 'center' } }>
                    { `Waiting for other players to complete ${reportType}...` }
                  </h2>
                </div>
              ) : (
                <BessiAssessmentSection
                  reportType={ reportType }
                  bessiVersion={ BESSI_VERSION }
                  onCompletion={ onCompletion }
                />
              ) }
            </>
          ) }
        </>
      ) }
    </>
  )
}

export default SelfReportOrObserverReport