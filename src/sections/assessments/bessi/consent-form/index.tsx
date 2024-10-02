// Externals
import { FC, useContext } from 'react'
// Locals
import AssessmentButton from '@/components/Buttons/Assessment'
// Sections
import Content from '@/sections/assessments/bessi/consent-form/content'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { GamePhases } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



type BessiConsentForm = {
  onCompletion?: (e: any) => void
}



const buttonText = `I agree`
const href = `/bessi/assessment`



const BessiConsentForm: FC<BessiConsentForm> = ({
  onCompletion,
}) => {
  // Contexts
  const {
    isGameInSession,
  } = useContext<GameSessionContextType>(GameSessionContext)



  return (
    <>
      <Content />

      { isGameInSession && onCompletion ? (
        <>
          <div style={ { float: 'right' } }>
            <button
              className={ styles.button }
              style={ { width: '80px' } }
              onClick={ (e: any) => onCompletion(e) }
            >
              { buttonText }
            </button>
          </div>
        </>
      ) : (
        <>
          <AssessmentButton href={ href } buttonText={ buttonText } />
        </>
      )}
    </>
  )
}

export default BessiConsentForm