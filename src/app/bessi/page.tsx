'use client'

// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
import { Fragment, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import Bessi from '@/sections/assessments/bessi'
// Hooks
import useAccount from '@/hooks/useAccount'
// Utils
import { STUDY_SIMPLE__DYNAMODB } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'





export default function _() {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { 
    isAdmin,
    userStudies,
    isParticipant,
    isFetchingAccount,
  } = useAccount()
  // States
  const [
    studiesForAssessment,
    setStudiesForAssessment
  ] = useState<STUDY_SIMPLE__DYNAMODB[] | []>([])
  const [
    isGettingStudiesForAssessment,
    setIsGettingStudiesForAssessment
  ] = useState(true)
  const [ 
    currentStudy, 
    setCurrentStudy 
  ] = useState<STUDY_SIMPLE__DYNAMODB | null>(null)
  const [ selectedStudyId, setSelectedStudyId ] = useState<string>('')


  function handleSelectCurrentStudy(e: any): void {
    const { value } = e.target

    setSelectedStudyId(value)

    const selectedStudy = studiesForAssessment.find(
      (study: STUDY_SIMPLE__DYNAMODB): boolean => study.id === value
    )

    if (selectedStudy) {
      const key = 'currentStudy'
      const value = JSON.stringify(selectedStudy)
      localStorage.setItem(key, value)
      setCurrentStudy(selectedStudy)
    }
  }


  function getStudiesForAssessment() {
    const filteredStudies = (userStudies as STUDY_SIMPLE__DYNAMODB[]).filter(
      (study: STUDY_SIMPLE__DYNAMODB): boolean => study.assessmentId === 'bessi'
    )

    setStudiesForAssessment(filteredStudies)
  }


  useLayoutEffect(() => {
    if (!isFetchingAccount) {
      if (!isAdmin) {
        if (userStudies) {
          getStudiesForAssessment()

          const timeout = 300
      
          const updateIsGettingStudiesTimeout = setTimeout(() => {
            setIsGettingStudiesForAssessment(false)
          }, timeout)
      
          return () => {
            updateIsGettingStudiesTimeout
          }
        }
      } else {
        setIsGettingStudiesForAssessment(false)
      }
    }
  }, [ isAdmin, userStudies, isFetchingAccount ])




  return (
    <>
      { isGettingStudiesForAssessment ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
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
                )}
              </>
            ) }
          </main>
        </>
      ) }
    </>
  )
}