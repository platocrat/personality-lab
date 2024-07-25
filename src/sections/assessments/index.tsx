'use client'

// Externals
import {
  useState,
  Fragment,
  ReactNode,
  useContext,
  useLayoutEffect,
} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
// Sections
import AssessmentCards from './assessment-cards'
// Hooks
import useAccount from '@/hooks/useAccount'
// Hooks
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
  // Auth0 
  const { user, error, isLoading } = useUser()
  // Contexts
  const { 
    isAdmin,
    participant,
    isParticipant,
  } = useAccount()
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
        style={{ top: isParticipant || isAdmin ? '0' : '' }}
      > 
        <div 
          style={{ 
            marginTop: isAdmin
              ? windowWidth > 800 
                ? '-24px' 
                : '-12px'
               : '', 
            marginBottom: '8px', 
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