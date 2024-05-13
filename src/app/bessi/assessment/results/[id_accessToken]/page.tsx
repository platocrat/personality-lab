'use client'

// Externals

import { FC, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiResultsVisualization, { 
  BessiSkillScoresContextType
} from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsExplanation from '@/sections/assessments/bessi/assessment/results/explanation'
import BessiWantToLearnMore from '@/sections/assessments/bessi/assessment/results/want-to-learn-more'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utils
import { jwtErrorMessages } from '@/utils'
// Types
import { 
  FacetFactorType, 
  BessiSkillScoresType,
  SkillDomainFactorType,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'






type BessiUserSharedResultsType = {
  params: {
    id_accessToken: string
  }
}


const rateUserResults = true




const BessiUserSharedResults: FC<BessiUserSharedResultsType> = ({ 
  params 
}) => {
  // Param
  const { id_accessToken } = params
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
  

  // Extract id and access token from the concatenated string
  const targetIndex = id_accessToken.indexOf('-')
  const id = id_accessToken.slice(0, targetIndex)
  const accessToken = id_accessToken.slice(
    targetIndex + 1, 
    id_accessToken.length
  )
  
  const errorMessage =  isAccessTokenExpired 
    ? `Access token expired!`
    : `ID and access token were not found!`
  
  // Memoized constants
  const errorStatus = useMemo((): boolean => {
    setIsDataLoading(false)
    return isAccessTokenExpired || !accessToken
  }, [ isAccessTokenExpired, accessToken ])


  async function getUserResults() {
    try {
      const response = await fetch('/bessi/assessment/api/share-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: id,
          accessToken: accessToken,
        })
      })

      const json = await response.json()

      if (response.status === 200) {
        const userResults = json.data

        const bessiSkillScores_: BessiSkillScoresType = {
          id: id,
          accessToken: accessToken,
          facetScores: userResults.facetScores,
          domainScores: userResults.domainScores,
        }

        setBessiSkillScores(bessiSkillScores_)
      } else if (json.error === 'Access token expired') {
        setIsAccessTokenExpired(true)
      } else {
        const error = `Error posting BESSI results to DynamoDB: `
        /**
         * @todo Handle error UI here
        */
       throw new Error(error, json.error)
      }
    } catch (error: any) {
      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }


  useLayoutEffect(() => {
    if (!id || !accessToken) {
      setIsDataLoading(true)

      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(
        `Error: 'accessToken' or 'id' is invalid , see 'accessToken': ${
          accessToken
        } and ${ id }!`
      )
    } else {
      const requests = [
        getUserResults()
      ]

      Promise.all(requests)
    }
  }, [id, accessToken])



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