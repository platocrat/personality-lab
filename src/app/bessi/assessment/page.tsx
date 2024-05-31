'use client'

// Externals
import { 
  FC, 
  Fragment, 
  useState,
  useContext, 
  useLayoutEffect,
} from 'react'
// Locals
// Sections
import Bessi from '@/sections/assessments/bessi'
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
import { CurrentParticipantStudyContext } from '@/contexts/CurrentParticipantStudyContext'
// CSS
import styles from '@/app/page.module.css'


type BessiAssessmentProps = {}



type STUDY_SIMPLE__DYNAMODB = {
  id: string
  name: string
  ownerEmail: string
  adminEmails?: string[]
  assessmentId: string
  timestamp: number
}

type CurrentStudy = STUDY_SIMPLE__DYNAMODB
type UserStudies = STUDY_SIMPLE__DYNAMODB[]



const BessiAssessment: FC<BessiAssessmentProps> = ({ }) => {
  // Contexts
  const {
    userStudies,
    isParticipant,
  } = useContext(AuthenticatedUserContext)
  const { 
    currentStudy, 
    setCurrentStudy 
  } = useContext(CurrentParticipantStudyContext)
  // States
  const [
    studiesForAssessment, 
    setStudiesForAssessment
  ] = useState<STUDY_SIMPLE__DYNAMODB[] | []>([])
  const [ selectedStudyId, setSelectedStudyId ] = useState<string>('')


  function handleSelectCurrentStudy(e: any): void {
    const { value } = e.target

    setSelectedStudyId(value)
    
    const selectedStudy = studiesForAssessment.find(
      (study: STUDY_SIMPLE__DYNAMODB): boolean => study.id === value
    )

    if (selectedStudy) {
      setCurrentStudy(selectedStudy)
    }
  }


  useLayoutEffect(() => {
    const filteredStudies = (userStudies as STUDY_SIMPLE__DYNAMODB[]).filter(
      (study: STUDY_SIMPLE__DYNAMODB): boolean => study.assessmentId === 'bessi'
    )

    setStudiesForAssessment(filteredStudies)
  }, [ userStudies ])




  return (
    <>
      <main className={ `${styles.main} ` }>
        { !isParticipant ? <BessiAssessmentSection /> : (
          <>
            { studiesForAssessment.length > 0 && (
              <>
                <select 
                  value={ selectedStudyId }
                  onChange={ handleSelectCurrentStudy } 
                >
                  <option value=''>{ `Select a study` }</option>
                  { studiesForAssessment.map((
                    study: STUDY_SIMPLE__DYNAMODB, 
                    i: number
                  ) => (
                    <Fragment key={ i }>
                      <option key={ study.id } value={ study.id }>
                        { study.name }
                      </option>
                    </Fragment>
                  )) }
                </select>
              </>
            )}

            { currentStudy && <BessiAssessmentSection /> }
          </>
        )}
      </main>
    </>
  )
}

export default BessiAssessment