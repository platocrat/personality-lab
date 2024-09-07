'use client'

// Externals
import {
  useState,
  Fragment,
  ReactNode,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
// Sections
import AssessmentCards from './assessment-cards'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// Hooks
// import useAccount from '@/hooks/useAccount'
import useWindowWidth from '@/hooks/useWindowWidth'
// Utils
import {
  ACCOUNT__DYNAMODB,
  PARTICIPANT__DYNAMODB,
} from '@/utils'
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
  const {
    participant,
  } = useContext<SessionContextType>(SessionContext)
  // Hooks
  // const { participant } = useAccount()
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
          <AssessmentCards
            fragmentKey={ fragmentKey }
            participant={ participant }
          />
        </div>

      </div>
    </Fragment>
  )
}


export default PersonalityAssessments