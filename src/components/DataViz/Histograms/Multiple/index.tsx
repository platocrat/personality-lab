// Externals
import Image from 'next/image'
import { FC, useLayoutEffect, useRef, useState } from 'react'
// Locals
import Histogram from '@/components/DataViz/Histograms/Single'
// Utils
import {
  Gender,
  USState,
  YesOrNo,
  SocialClass,
  RaceOrEthnicity,
  STUDY__DYNAMODB,
  RESULTS__DYNAMODB,
  CurrentMaritalStatus,
  HighestFormalEducation,
  CurrentEmploymentStatus,
  BessiUserResults__DynamoDB,
  getDummyPopulationBessiScores,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
// Types
import { 
  BessiUserDataVizType 
} from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/DataViz/Histograms/Histogram.module.css'
import listOfStudiesStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type PopulationResultType = {
  facetScores: {
    [key: string]: number[]
  }
  domainScores: {
    [key: string]: number[]
  }
}

export type PopulationResults = {
  demographics: BessiUserDemographics__DynamoDB
  results: PopulationResultType
}


type MultipleHistogramsProps = {
  userData: BessiUserDataVizType
  email?: string
  // auth0: {
  //   user: any
  //   error: any
  //   isLoading: boolean
  // }
  isExample?: boolean
  studyId?: string
}




const MultipleHistograms: FC<MultipleHistogramsProps> = ({
  // auth0,
  email,
  studyId,
  userData,
  isExample,
}) => {
  // // Auth0 
  // const { user, error, isLoading } = auth0
  // Refs
  const filterRef = useRef<any>(null)
  // State
  const [ 
    populationResults, 
    setPopulationResults, 
  ] = useState<PopulationResults | null>(null)
  const [ 
    filteredResults, 
    setFilteredResults 
  ] = useState<PopulationResults | null>(null)
  const [ 
    genderFilter, 
    setGenderFilter 
  ] = useState<Gender | undefined>(undefined)
  const [
    studyResults,
    setStudyResults
  ] = useState<(any | BessiUserResults__DynamoDB)[] | undefined>(undefined)
  const [ view, setView ] = useState<'domain' | 'facet'>('domain')
  const [ showFilterMenu, setShowFilterMenu ] = useState(false)
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

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu)
  }


  // ------------------------- Filtering Functions -----------------------------
  function filterResults(): PopulationResults {
    if (!ageFilter && !genderFilter) return populationResults as PopulationResults

    const filteredResults: PopulationResults = {
      results: {
        facetScores: {},
        domainScores: {},
      },
      demographics: {
        age: 28,
        gender: Gender.Male,
        usState: USState.Illinois,
        zipCode: '60077',
        isParent: YesOrNo.No,
        foreignCountry: '',
        englishFluency: YesOrNo.Yes,
        priorCompletion: YesOrNo.Yes,
        socialClass: SocialClass.LowerMiddleClass,
        raceOrEthnicity: RaceOrEthnicity.HispanicLatinAmerican,
        currentMaritalStatus: CurrentMaritalStatus.NeverMarried,
        highestFormalEducation: HighestFormalEducation.SomeCollege,
        currentEmploymentStatus: CurrentEmploymentStatus.WorkPartTime,
      }
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
              if (!filteredResults.results.facetScores[key]) {
                filteredResults.results.facetScores[key] = []
              }

              filteredResults.results.facetScores[key].push(value)
            }
          })

          Object.entries(result.domainScores).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (!filteredResults.results.domainScores[key]) {
                filteredResults.results.domainScores[key] = []
              }

              filteredResults.results.domainScores[key].push(value)
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
      results: {
        facetScores: {},
        domainScores: {},
      },
      demographics: {
        age: 28,
        gender: Gender.Male,
        usState: USState.Illinois,
        zipCode: '60077',
        isParent: YesOrNo.No,
        foreignCountry: '',
        englishFluency: YesOrNo.Yes,
        priorCompletion: YesOrNo.Yes,
        socialClass: SocialClass.LowerMiddleClass,
        raceOrEthnicity: RaceOrEthnicity.HispanicLatinAmerican,
        currentMaritalStatus: CurrentMaritalStatus.NeverMarried,
        highestFormalEducation: HighestFormalEducation.SomeCollege,
        currentEmploymentStatus: CurrentEmploymentStatus.WorkPartTime,
      }
    }

    // Iterate over all study results
    studyResults?.forEach((result: any | BessiUserResults__DynamoDB) => {
      if (result.facetScores && result.domainScores) {
        // Process facetScores
        Object.entries(result.facetScores).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (!populationResults.results.facetScores[key]) {
              populationResults.results.facetScores[key] = []
            }

            populationResults.results.facetScores[key].push(value)
          }
        })

        // Process domainScores
        Object.entries(result.domainScores).forEach(([key, value]) => {
          if (typeof value === 'number') {
            if (!populationResults.results.domainScores[key]) {
              populationResults.results.domainScores[key] = []
            }

            populationResults.results.domainScores[key].push(value)
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
      const apiEndpoint = `/api/v1/assessment/results?studyId=${ studyId }`
      const response = await fetch(apiEndpoint, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const resultsWithMetadata = json.resultsPerStudyId as RESULTS__DYNAMODB[]
      const assessmentId_ = resultsWithMetadata[0].assessmentId
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
    // if (!isLoading && user && user.email) {
    if (email) {
      if (studyId) {
        const requests = [
          getStudyResults()
        ]
    
        Promise.all(requests)
      } else {
        // If `studyId` does not exist, use dummy data.
        const histogramPopulationDummyData: PopulationResults = {
          results: {
            facetScores: getDummyPopulationBessiScores(100, 'facet'),
            domainScores: getDummyPopulationBessiScores(100, 'domain'),
          },
          demographics: {
            age: 28,
            gender: Gender.Male,
            usState: USState.Illinois,
            zipCode: '60077',
            isParent: YesOrNo.No,
            foreignCountry: '',
            englishFluency: YesOrNo.Yes,
            priorCompletion: YesOrNo.Yes,
            socialClass: SocialClass.LowerMiddleClass,
            raceOrEthnicity: RaceOrEthnicity.HispanicLatinAmerican,
            currentMaritalStatus: CurrentMaritalStatus.NeverMarried,
            highestFormalEducation: HighestFormalEducation.SomeCollege,
            currentEmploymentStatus: CurrentEmploymentStatus.WorkPartTime,
          }
        }

        setPopulationResults(histogramPopulationDummyData)
      }
    // } else if (!isLoading && !user) {
    } else {
      // console.error(
      //   `Auth0 couldn't get 'user' from useUser(): `,
      //   error
      // )

      console.error(`Couldn't get the user's email`)
    }
  }, [ /* isLoading */ email ])


  useLayoutEffect(() => {
    getPopulationResults()
  }, [ studyResults ])


  useLayoutEffect(() => {
    updateFilteredResults()
  }, [ populationResults,  ageFilter,  genderFilter ])





  return (
    <>
      <div style={{ ...definitelyCenteredStyle }}>
        {/* Filter settings section */}
        <div 
          style={{ 
            ...definitelyCenteredStyle,
            display: 'inline-block',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex' }}>
            {/* Filter domain scores and Facet scores */}
            <div 
              style={ {
                position: 'relative', 
                marginBottom: '24px', 
                marginRight: '24px', 
                top: '2.5px' 
              } }
            >
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
            {/* Filter button */}
            <button
              className={ styles['filter-button'] }
              onClick={ toggleFilterMenu }
              style={ { 
                ...definitelyCenteredStyle, 
                marginBottom: '24px',
                boxShadow: showFilterMenu 
                  ? '0px 1px 3.5px inset rgba(0, 80, 172, 0.514)'
                  : ''
              } }
            >
              <Image
                alt='Filter svg icon'
                width={ 16 }
                height={ 16 }
                src={ '/icons/svg/filter.svg' }
              />
              <p 
                style={ { 
                  fontSize: 'clamp(9.5px, 2.5vw, 12.5px)', 
                  margin: '0px 3px',
                } }
              >
                { `Filter` }
              </p>
            </button>
          </div>


          { showFilterMenu && (
            <>
              <div 
                ref={ filterRef } 
                style={{ position: 'relative' }}
              >
                <div 
                  className={ `${listOfStudiesStyles.dropdown}` }
                  style={ { 
                    border: '0.25px solid #F4F6FA',
                    flexDirection: 'column',
                    position: 'absolute',
                    right: '0',
                    top: '-26.5px',
                    borderRadius: '12px',
                    padding: '10px 10px 0px 10px',
                    fontSize: 'clamp(9.5px, 2.5vw, 12.5px)',
                    backgroundColor: '#F4F6FA',
                    borderColor: 'rgba(0, 80, 172, 0.3514)',
                    borderWidth: '0.1px',
                  } }
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '150px',
                    }}
                  >
                    <div style={{ marginBottom: '12px',  }}>
                      <p
                        style={{
                          textAlign: 'center',
                          color: 'rgba(0, 80, 172, 1)',
                          fontSize: 'clamp(9.5px, 2.5vw, 12.5px)',
                        }}
                      >
                        { `Filter by:` }
                      </p>
                    </div>

                    <div 
                      style={ { 
                        marginBottom: '18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      } }
                    >
                      <label 
                        htmlFor='age-filter'
                        style={{
                          position: 'relative',
                          display: 'flex',
                          top: '2px',
                          color: 'rgb(0, 80, 172)',
                        }}
                      >
                        { `Age` }
                      </label>
                      <input
                        id='age-filter'
                        type='number'
                        min={ 0 }
                        value={ ageFilter || '' }
                        style={ { width: '50px' } }
                        onChange={ handleOnChangeAgeFilter }
                      />
                    </div>
                    <div 
                      style={ { 
                        marginBottom: '18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      } }
                    >
                      <label
                        htmlFor='age-filter'
                        style={ {
                          position: 'relative',
                          display: 'flex',
                          top: '2px',
                          color: 'rgb(0, 80, 172)',
                        } }
                      >
                        { `Gender` }
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
              </div>
            </>
          ) }
        </div>
      </div>


      { filteredResults?.results.facetScores && 
        filteredResults?.results.domainScores && (
        <>  
          { view === 'facet' &&
            Object.entries(
              filteredResults?.results?.facetScores
            ).map(([key, scoresArray]) => (
              <div key={ `facet-${key}` }>
                <Histogram
                  data={ scoresArray }
                  isExample={ isExample }
                  title={ `Facet Score: ${key}` }
                  score={ userData.facetScores[key] }
                />
              </div>
            )) }
          { view === 'domain' &&
            Object.entries(
              filteredResults?.results?.domainScores
            ).map(([key, scoresArray]) => (
              <div key={ `domain-${key}` }>
                <Histogram
                  data={ scoresArray }
                  isExample={ isExample }
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