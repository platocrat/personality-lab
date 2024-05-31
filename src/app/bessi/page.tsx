'use client'

// Externals
import { Fragment, useContext, useLayoutEffect, useState } from 'react'
// Locals
// Sections
import Bessi from '@/sections/assessments/bessi'
// Utils
import { STUDY_SIMPLE__DYNAMODB } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
import { CurrentParticipantStudyContext } from '@/contexts/CurrentParticipantStudyContext'





export default function _() {
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
  const [selectedStudyId, setSelectedStudyId] = useState<string>('')


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
  }, [userStudies])





  return (
    <>
      <main className={ `${styles.main}` }>
        { !isParticipant ? <Bessi /> : (
          <>
            { !currentStudy && 
              studiesForAssessment.length > 0 ? (
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
              ) : (
                <Bessi />
              )
            }
          </>
        ) }
      </main>
    </>
  )
}