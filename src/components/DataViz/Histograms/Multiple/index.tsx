// Externals
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import Histogram from '@/components/DataViz/Histograms/Single'
// Utils
import {
  STUDY__DYNAMODB,
  RESULTS__DYNAMODB,
  BessiUserResults__DynamoDB,
  getDummyPopulationBessiScores,
  Gender
} from '@/utils'
// Types
import { 
  BessiUserDataVizType 
} from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import { filter } from 'd3'
import { definitelyCenteredStyle } from '@/theme/styles'



export type PopulationResults = {
  [ key: string ]: { 
    [key: string]: number[]
  }
}


type MultipleHistogramsProps = {
  studyId?: string
  userData: BessiUserDataVizType
  auth0: {
    user: any
    error: any
    isLoading: boolean
  }
}




const MultipleHistograms: FC<MultipleHistogramsProps> = ({
  auth0,
  studyId,
  userData,
}) => {
  // Auth0 
  const { user, error, isLoading } = auth0
  // State
  const [ 
    populationResults, 
    setPopulationResults, 
  ] = useState<PopulationResults>({})
  const [ 
    filteredResults, 
    setFilteredResults 
  ] = useState<PopulationResults>({})
  const [ 
    genderFilter, 
    setGenderFilter 
  ] = useState<Gender | undefined>(undefined)
  const [
    studyResults,
    setStudyResults
  ] = useState<(any | BessiUserResults__DynamoDB)[] | undefined>(undefined)
  const [ view, setView ] = useState<'domain' | 'facet'>('domain')
  const [ assessmentId, setAssessmentId ] = useState<string | undefined>('')
  const [ ageFilter, setAgeFilter ] = useState<number | undefined>(undefined)


  // --------------------------- onChange handlers -----------------------------
  const handleOnChangeHistogramView = (e: any) => {
    setView(e.target.value as 'domain' | 'facet') 
  }

  const handleOnChangeAgeFilter = (e: any) => {
    setAgeFilter(Number(e.target.value) || undefined)
  }

  const handleOnChangeGenderFilter = (e: any) => {
    setGenderFilter(e.target.value as Gender || undefined)
  }


  // ------------------------- Filtering Functions -----------------------------
  function filterResults(): PopulationResults {
    if (!ageFilter && !genderFilter) return populationResults

    const filteredResults: PopulationResults = {
      facetScores: {},
      domainScores: {},
    }


    studyResults?.forEach((result: any | BessiUserResults__DynamoDB) => {
      if (result.facetScores && result.domainScores) {
        const demographic = result.demographics
        let include = true

        if (ageFilter && demographic.age !== ageFilter) {
          include = false
        }

        if (genderFilter && demographic.gender !== genderFilter) {
          include = false
        }


        if (include) {
          Object.entries(result.facetScores).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (!filteredResults.facetScores[key]) {
                filteredResults.facetScores[key] = []
              }

              filteredResults.facetScores[key].push(value)
            }
          })

          Object.entries(result.domainScores).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (!filteredResults.domainScores[key]) {
                filteredResults.domainScores[key] = []
              }

              filteredResults.domainScores[key].push(value)
            }
          })
        }
      }
    })

    return filteredResults
  }


  // ------------------------- Utility functions -------------------------------
  /**
   * @dev Gets the population results to use to compare the user's results 
   *      against.
   */
  function getPopulationResults(): PopulationResults {
    const populationResults: PopulationResults = {
      facetScores: {},
      domainScores: {}
    }

    // Iterate over all study results
    studyResults?.forEach((result: any | BessiUserResults__DynamoDB) => {
      if (result.facetScores && result.domainScores) {
        // Process facetScores
        Object.entries(result.facetScores).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (!populationResults.facetScores[key]) {
              populationResults.facetScores[key] = []
            }

            populationResults.facetScores[key].push(value)
          }
        })

        // Process domainScores
        Object.entries(result.domainScores).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (!populationResults.domainScores[key]) {
              populationResults.domainScores[key] = []
            }

            populationResults.domainScores[key].push(value)
          }
        })
      }
    })

    return populationResults
  }


  function updateFilteredResults() {
    const filteredResults_ = filterResults()
    console.log(`filteredResults_`, filteredResults_)
    setFilteredResults(filteredResults_)
  }


  // --------------------------- Async functions -------------------------------
  async function getStudyResults() {
    try {
      const response = await fetch(`/api/study?id=${studyId}`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const study = (json.study as STUDY__DYNAMODB[])[0]
      const resultsWithMetadata = study.results as RESULTS__DYNAMODB[]
      const assessmentId_ = resultsWithMetadata[0].study?.assessmentId
      const studyResults_ = resultsWithMetadata.map((
        _: RESULTS__DYNAMODB) => _.results as any | BessiUserResults__DynamoDB
      )

      setAssessmentId(assessmentId_)
      setStudyResults(studyResults_)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // ------------------------- `useLayoutEffect`s ------------------------------
  useLayoutEffect(() => {
    if (!isLoading && user && user.email) {
      if (studyId) {
        const requests = [
          getStudyResults()
        ]
    
        Promise.all(requests)
      } else {
        // If studyId does not exist, use dummy data.
        const histogramPopulationDummyData = {
          facetScores: getDummyPopulationBessiScores(100, 'facet'),
          domainScores: getDummyPopulationBessiScores(100, 'domain')
        }

        setPopulationResults(histogramPopulationDummyData)
      }
    } else if (!isLoading && !user) {
      console.error(
        `Auth0 couldn't get 'user' from useUser(): `,
        error
      )
    }
  }, [ isLoading ])


  useLayoutEffect(() => {
    getPopulationResults()
  }, [ studyResults ])


  useLayoutEffect(() => {
    updateFilteredResults()
  }, [ populationResults,  ageFilter,  genderFilter ])





  return (
    <>
      <div style={ { marginTop: '36px' } }>
        <div style={ { marginBottom: '24px' } }>
          <select
            id='view-select'
            value={ view }
            onChange={ handleOnChangeHistogramView }
          >
            <option value='domain'>
              { `Domain Scores` }
              </option>
            <option value='facet'>
              { `Facet Scores` }
            </option>
          </select>
        </div>
        <div 
          style={{ 
            ...definitelyCenteredStyle,
            flexDirection: 'row',
            gap: '24px',
            marginBottom: '12px',
            fontSize: '13px',
          }}
        >
          <div style={ { marginBottom: '18px' } }>
            <label htmlFor='age-filter'>
              { `Age: ` }
            </label>
            <input
              id='age-filter'
              type='number'
              value={ ageFilter || '' }
              onChange={ handleOnChangeAgeFilter }
            />
          </div>
          <div style={ { marginBottom: '18px' } }>
            <label htmlFor='gender-filter'>
              { `Gender: ` }
            </label>
            <select
              id='gender-filter'
              value={ genderFilter || '' }
              onChange={ handleOnChangeGenderFilter }
            >
              <option value=''>{ `Any` }</option>
              <option value='male'>{ `Male` }</option>
              <option value='female'>{ `Female` }</option>
              <option value='non-binary'>{ `Non-binary` }</option>
              <option value='other'>{ `Other` }</option>
            </select>
          </div>
        </div>
      </div>

      { filteredResults.facetScores && filteredResults.domainScores && (
        <>  
          { view === 'facet' &&
            Object.entries(
              filteredResults.facetScores
            ).map(([key, scoresArray]) => (
              <div key={ `facet-${key}` }>
                <Histogram
                  data={ scoresArray }
                  title={ `Facet Score: ${key}` }
                  score={ userData.facetScores[key] }
                />
              </div>
            )) }
          { view === 'domain' &&
            Object.entries(
              filteredResults.domainScores
            ).map(([key, scoresArray]) => (
              <div key={ `domain-${key}` }>
                <Histogram
                  data={ scoresArray }
                  title={ `Domain Score: ${key}` }
                  score={ userData.domainScores[key] }
                />
              </div>
            )) }
        </>
      )}
    </>
  )
}


export default MultipleHistograms