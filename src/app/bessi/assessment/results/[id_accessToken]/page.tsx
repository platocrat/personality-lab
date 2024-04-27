'use client'

// Externals
import { Inter } from 'next/font/google'
import { FC, useContext, useEffect, useLayoutEffect, useState } from 'react'
// Locals
import BessiResultsVisualization, { 
  BessiSkillScoresContextType
} from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsExplanation from '@/sections/assessments/bessi/assessment/results/explanation'
import BessiWantToLearnMore from '@/sections/assessments/bessi/assessment/results/want-to-learn-more'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Types
import { 
  FacetFactorType, 
  BessiSkillScores, 
  SkillDomainFactorType,
  BessiUserDemographics__DynamoDB, 
} from '@/utils/bessi/types'
// CSS
import styles from '@/app/page.module.css'


const inter = Inter({ subsets: ['latin'] })



type BessiUserSharedResultsType = {
  params: {
    id_accessToken: string
  }
}


const BessiUserSharedResults: FC<BessiUserSharedResultsType> = ({ 
  params 
}) => {
  // State
  const { setBessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  // Param
  const { id_accessToken } = params

  // Extract id and access token from the concatenated string
  const targetIndex = id_accessToken.indexOf('-')
  const id = id_accessToken.slice(0, targetIndex)
  const accessToken = id_accessToken.slice(
    targetIndex + 1, 
    id_accessToken.length
  )
  
  const errorMessage = `ID and access token were not found!`


  async function getUserResults() {
    try {
      const response = await fetch('/bessi/assessment/api/shared-results', {
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

        const bessiSkillScores_: BessiSkillScores = {
          id: id,
          accessToken: accessToken,
          facetScores: userResults.facetScores,
          domainScores: userResults.domainScores,
        }

        setBessiSkillScores(bessiSkillScores_)
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
      { !accessToken ? (
        <>
          <div style={ { maxWidth: '800px' } }>
            <div>{ errorMessage }</div>
          </div>
        </>
        ) : (
          <main className={ `${styles.main} ${inter.className}` }>
            <div style={ { maxWidth: '800px' } }>
              <BessiResultsExplanation />
              <BessiResultsVisualization />
              <BessiResultsSkillsScoresAndDefinitions />
              <BessiWantToLearnMore />
            </div>
          </main>
      ) }
    </>
  )
}

export default BessiUserSharedResults