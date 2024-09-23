// Externals
import {
  Fragment,
  ReactNode,
  useContext
} from 'react'
// Locals
// Sections
import AssessmentCards from './assessment-cards'
// Contexts
import { SessionContextType } from '@/contexts/types'
import { SessionContext } from '@/contexts/SessionContext'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// CSS
import styles from '@/app/page.module.css'



export type PersonalityAssessmentType = {
  href: string
  title: string
  buttonText: string
  assessmentId: string
  description: string | ReactNode
}



const title = `Assessments`




const PersonalityAssessments = ({ }) => {
  // Contexts
  const { isParticipant } = useContext<SessionContextType>(SessionContext)
  // Hooks
  const windowWidth = useWindowWidth()


  // ------------------------- Regular functions -------------------------------
  function fragmentKey(pa: PersonalityAssessmentType, i: number): string {
    const fragmentKeyBasePrefix = `personality-assessment-`
    const fragmentKeySuffix = `${pa.buttonText}-${pa.href}-${pa.title}-${i}`
    return fragmentKeyBasePrefix + fragmentKeySuffix
  }



  return (
    <Fragment key={ `personality-assessments` }>
      <div 
        className={ styles.main }
        style={{ top: isParticipant ? '24px' : '0' }}
      > 
        <div 
          style={{ 
            marginBottom: '8px',
            marginTop: windowWidth > 800 ? '-24px' : '-12px', 
          }}
        >
          <h1>{ title }</h1>
        </div>

        <div className={ styles.assessmentWrapper }>
          <AssessmentCards fragmentKey={ fragmentKey } />
        </div>

      </div>
    </Fragment>
  )
}


export default PersonalityAssessments