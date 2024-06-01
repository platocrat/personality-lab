'use client'

// Externals

import {
  FC,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiResultsExplanation from '@/sections/assessments/bessi/assessment/results/explanation'
import BessiWantToLearnMore from '@/sections/assessments/bessi/assessment/results/want-to-learn-more'
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Context types
import { BessiSkillScoresContextType } from '@/contexts/types'
// Utils
import {
  RESULTS__DYNAMODB,
  BessiUserResults__DynamoDB,
} from '@/utils'
// Types
import {
  BessiSkillScoresType
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'






type BessiUserSharedResultsType = {
  params: {
    id_accessToken_studyId: string
  }
}


const rateUserResults = true
const ASSESSMENT_ID = 'bessi'




const BessiUserSharedResults: FC<BessiUserSharedResultsType> = ({ 
  params 
}) => {
  // Param
  const { id_accessToken_studyId } = params
  // Contexts
  const { 
    bessiSkillScores,
    setBessiSkillScores,
  } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  // State
  const [ isDataLoading, setIsDataLoading ] = useState(false)
  const [ isAccessTokenExpired, setIsAccessTokenExpired ] = useState(false)
  

  // Split the string by the separator '--'
  const parts = (id_accessToken_studyId as string).split('--')

  if (parts.length !== 3) {
    throw new Error('Unexpected format: expected exactly 3 parts')
  }

  const id = parts[0]
  const accessToken = parts[1]
  const studyId = parts[2]
  
  const errorMessage =  isAccessTokenExpired 
    ? `Access token expired!`
    : `ID and access token were not found!`
  
  // Memoized constants
  const errorStatus = useMemo((): boolean => {
    setIsDataLoading(false)
    return isAccessTokenExpired || !accessToken || !id || !studyId
  }, [ isAccessTokenExpired, accessToken, id, studyId ])


  // --------------------------- Async functions -------------------------------
  async function getUserResults() {
    try {
      const apiEndpoint = `/api/assessment/share-results?id_accessToken_studyId=${ 
        id_accessToken_studyId 
      }`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()


      if (response.status === 200) {
        const userResults: RESULTS__DYNAMODB = json.userResults
        
        const { facetScores, domainScores } = (
          userResults.results as BessiUserResults__DynamoDB
        )

        const bessiSkillScores_: BessiSkillScoresType = {
          id,
          accessToken,
          studyId,
          facetScores,
          domainScores,
        }

        setBessiSkillScores(bessiSkillScores_)
      } else if (json.error === 'Access token expired') {
        setIsAccessTokenExpired(true)
      } else {
        const error = `Could not get results from the provided id: '${
          id
        }', access token: '${
          accessToken
        }', and studyId: '${ 
          studyId 
        }': `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      console.error(error)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }

  
  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    if (!id || !accessToken || !studyId) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(
        `Error: 'id', 'accessToken', or 'studyId' is invalid , see 'id': ${
          id
        }, 'accessToken': ${ 
          accessToken
        }, and 'studyId': ${
          studyId
        } !`
      )
    } else {
      setIsDataLoading(true)

      const requests = [
        getUserResults()
      ]

      Promise.all(requests).then((response: any) => {
        setIsDataLoading(false)
      })
    }
  }, [ id, accessToken, studyId ])




  return (
    <>
      { isDataLoading ? (
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
            { errorStatus ? (
              <>
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    marginTop: '100px'
                  } }
                >
                  <h2>{ errorMessage }</h2>
                </div>
              </>
            ) : (
              <main className={ `${styles.main} ` }>
                <div style={ { maxWidth: '800px' } }>
                  <BessiResultsExplanation />
                  <BessiResultsVisualization rateUserResults={ rateUserResults } />
                  <BessiResultsSkillsScoresAndDefinitions />
                  <BessiWantToLearnMore />
                </div>
              </main>
            ) }
        </>
      ) }
    </>
  )
}

export default BessiUserSharedResults