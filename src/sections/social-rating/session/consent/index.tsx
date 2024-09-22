// Externals
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import Bessi from '@/sections/assessments/bessi'
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Utils
import { Player } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css' 



type ConsentProps = {
  onCompletion: () => Promise<void>
}



const Consent: FC<ConsentProps> = ({
  onCompletion
}) => {
  // Contexts
  const {
    players,
    isGameInSession,
    isUpdatingGameState,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ 
    hasCompletedConsentForm, 
    setHasCompletedConsentForm
  ] = useState<boolean>(false)

  


  useLayoutEffect(() => {
    if (isGameInSession) {
      let hasCompletedConsentForm_ = false

      const storedPlayer = localStorage.getItem('player')
      
      if (storedPlayer) {
        const player = JSON.parse(storedPlayer) as Player
        hasCompletedConsentForm_ = player.inGameState.hasCompletedConsentForm
        setHasCompletedConsentForm(hasCompletedConsentForm_)
      } 
    }
  }, [ players ])




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
          { hasCompletedConsentForm ? (
            <>
              <div className={ styles['player-nickname-grid'] }>
                <h2>
                  { `Waiting for other players...` }
                </h2>
              </div>
            </>
          ) : (
            <>
              <Bessi onCompletion={ onCompletion } />
            </>
          ) }
        </>
      ) }
    </>
  )
}


export default Consent