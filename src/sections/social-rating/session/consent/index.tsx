// Externals
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import Bessi from '@/sections/assessments/bessi'
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Utils
import { Player } from '@/utils'
// CSS
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
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ 
    hasCompletedConsentForm, 
    setHasCompletedConsentForm
  ] = useState<boolean>(false)

  


  useLayoutEffect(() => {
    if (isGameInSession) {
      const storedPlayer = localStorage.getItem('player')
      
      if (storedPlayer) {
        const player = JSON.parse(storedPlayer) as Player
        setHasCompletedConsentForm(true)
      } else {
        setHasCompletedConsentForm(false)
      }
    }
  }, [ players ])




  return (
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
      )}

    </>
  )
}


export default Consent