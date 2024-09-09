// Externals
import {
  Fragment,
  ReactNode
} from 'react'
// Locals
// Sections
import AssessmentCards from './assessment-cards'
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
        style={{ top: '0' }}
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