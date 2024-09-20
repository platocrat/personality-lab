// Externals
import { FC, useContext } from 'react'
// Locals
import Results from '@/sections/social-rating/session/results'
import Consent from '@/sections/social-rating/session/consent'
import SelfReport from '@/sections/social-rating/session/self-report'
import ObserverReport from '@/sections/social-rating/session/observer-report'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { GamePhases } from '@/utils'



type InGameProps = {

}




const InGame: FC<InGameProps> = ({

}) => {
  // Contexts
  const {
    phase,
    setPhase,
    // players,
  } = useContext<GameSessionContextType>(GameSessionContext)


  const handleInGameConsentAgreement = (e: any): void => {
    setPhase(GamePhases.SelfReport)
  }


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





  return (
    <>
      <div>
        { phase === GamePhases.ConsentForm && (
          <Consent
            onCompletion={ handleInGameConsentAgreement }
          />
        ) }

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
    </>
  )
}

export default InGame