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
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
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
    email,
    isAdmin,
    isParticipant,
  } = useContext(AuthenticatedUserContext)
  // States
  const [ 
    isGettingParticipant, 
    setIsGettingParticipant
  ] = useState<boolean>(false)
  const [ 
    participant, 
    setParticipant 
  ] = useState<PARTICIPANT__DYNAMODB | null>(null)


  // ------------------------- Regular functions -------------------------------
  function fragmentKey(pa: PersonalityAssessmentType, i: number): string {
    const fragmentKeyBasePrefix = `personality-assessment-`
    const fragmentKeySuffix = `${pa.buttonText}-${pa.href}-${pa.title}-${i}`
    return fragmentKeyBasePrefix + fragmentKeySuffix
  }


  // ---------------------------- Async functions ------------------------------
  /**
   * @dev Request account entry from `accounts` table which has a `participant`
   *      property.
   */
  async function getParticipant() {
    setIsGettingParticipant(true)

    try {
      const response = await fetch(`/api/account?email=${ email }`, { method: 'GET' })

      const json = await response.json()

      if (response.status === 404) throw new Error(json.error)
      if (response.status === 400) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      if (response.status === 200) {
        const account: ACCOUNT__DYNAMODB = json.account
        const participant_ = account?.participant ?? null
        
        setParticipant(participant_)
        setIsGettingParticipant(false)
      }
    } catch (error: any) {
      setIsGettingParticipant(false)
      throw new Error(error)
    }
  }

  // ---------------------------- `useLayoutEffect`s ---------------------------
  useLayoutEffect(() => {
    if (email) {
      const requests = [
        getParticipant(),
      ]
  
      Promise.all(requests)
    }
  }, [ email, isAdmin, isParticipant ])




  return (
    <Fragment key={ `personality-assessments` }>
      <div 
        className={ styles.main }
        style={{ top: isParticipant || isAdmin ? '0' : '' }}
      >
        
        <div style={{ marginBottom: '8px' }}>
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