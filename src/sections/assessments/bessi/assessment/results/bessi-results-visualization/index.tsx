'use client'

// Externals
import {
  FC,
  useRef,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
// Sections
import TitleDropdown from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/title-dropdown'
import UserVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/user-visualization'
// Components
import {
  RIDGELINE_DEMO_DOMAIN_DATA,
  RIDGELINE_DEMO_FACET_DATA,
} from '@/components/DataViz/DemoRidgeline/dummy-data'
import MultipleNormalDistributions, {
  MultipleNormalDistributionDataType
} from '@/components/DataViz/Distributions/Normal/Multiple'
import Title from '@/components/DataViz/Title'
import TreeMap from '@/components/DataViz/TreeMap'
import StellarPlot from '@/components/DataViz/StellarPlot'
import ShareResults from '@/components/DataViz/ShareResults'
import Histogram from '@/components/DataViz/Histograms/Single'
import RadialBarChart from '@/components/DataViz/BarChart/Radial'
import DemoRidgelinePlot from '@/components/DataViz/DemoRidgeline'
import BarChartPerDomain from '@/components/DataViz/BarChart/PerDomain'
import MultipleHistograms from '@/components/DataViz/Histograms/Multiple'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
import ResultsVisualizationModal from '@/components/Modals/BESSI/ResultsVisualization'
import SingleNormalDistributionChart from '@/components/DataViz/Distributions/Normal/Single'
// Dummy data
import {
  generateDummyBessiUserScores
} from '@/components/DataViz/BarChart/PerDomain/dummy-data'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Context Types
import {
  BessiSkillScoresContextType
} from '@/contexts/types'
import { SessionContextType } from '@/contexts/types'
// Utils
import {
  transformData,
  UserScoresType,
  FacetFactorType,
  RATINGS__DYNAMODB,
  StellarPlotDataType,
  calculateBessiScores,
  SkillDomainFactorType,
  getRandomValueInRange,
  BarChartInputDataType,
  BarChartTargetDataType,
  STUDY_SIMPLE__DYNAMODB,
  getDummyPopulationBessiScores,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/BessiResultsVisualization.module.css'




type BessiResultsVisualizationType = {
  isExample?: boolean
  rateUserResults?: boolean
  facetScores?: FacetFactorType,
  domainScores?: SkillDomainFactorType,
}


export type BessiUserDataVizType = {
  facetScores: FacetFactorType,
  domainScores: SkillDomainFactorType,
}

export type UserDataForVizType = StellarPlotDataType[] 
  | BarChartTargetDataType[] 
  | BessiUserDataVizType




const BessiResultsVisualization: FC<BessiResultsVisualizationType> = ({
  isExample,
  facetScores,
  domainScores,
  rateUserResults,
}) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()
  
  // Contexts
  const { email } = useContext<SessionContextType>(SessionContext)
  const {
    bessiSkillScores 
  } = useContext<BessiSkillScoresContextType>(BessiSkillScoresContext)
  // Refs
  const modalRef = useRef<any>(null)
  const screenshot1Ref = useRef<any>(null)
  const screenshot2Ref = useRef<any>(null)

  // States
  // Booleans
  const [ isOpen, setIsOpen ] = useState(false)
  const [ isRating, setIsRating ] = useState(false)
  const [ isCopied, setIsCopied ] = useState(false)
  const [ showComparison, setShowComparison ] = useState(false)
  const [ isModalVisible, setIsModalVisible ] = useState(false)
  // Strings
  const [ screenshotUrl, setScreenshotUrl ] = useState('')
  // Numbers
  const [ 
    selectedRadialBarChart, 
    setSelectedRadialBarChart 
  ] = useState(0)
  const [ currentVisualization, setCurrentVisualization ] = useState(0)


  // Updated visualizations arrays
  const selfVisualizations = [
    { name: 'Stellar Plot', imgName: 'stellar-plot' },
    { name: 'Bar Graph', imgName: 'bar-graph' },
    { name: 'Radial Bar Graph', imgName: 'radial-bar-graph' },
    { name: 'Tree Map', imgName: 'tree-map' },
    { name: 'Personality Visualization', imgName: 'personality-visualization' },
    { name: 'Normal Distribution', imgName: 'normal-distribution' }
  ]

  const comparisonVisualizations = [
    { name: 'Histogram', imgName: 'histogram' },
    { name: 'Ridgeline Plot', imgName: 'ridgeline-plot' },
    { name: 'Multiple Normal Distributions', imgName: 'multiple-normal-distributions' },
  ]

  // Determine the visualizations to render based on the toggle state
  const visualizations = showComparison 
    ? comparisonVisualizations 
    : selfVisualizations
  
  // ------------------------- Regular functions -------------------------------
  // ~~~~~~~~ Event handlers ~~~~~~~~
  function handleOnChangeRadialBarChart(e: any) {
    const { value } = e.target
    setSelectedRadialBarChart(value)
  }

  // Handle toggle between self and comparison visualization views
  const handleToggleVisualizationType = () => {
    setCurrentVisualization(0)
    setShowComparison(prevState => !prevState)
  }

  const handleTakeScreenshot = () => {
    if (screenshot1Ref.current) {
      html2canvas(
        screenshot1Ref.current,
        {
          logging: true,
          useCORS: true,
        }
      ).then((canvas: any) => {
        canvas.toBlob((blob: any) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            setScreenshotUrl(url)
            setIsModalVisible(true) // Show modal after taking screenshot
          }
        }, 'image/png')
      })
    }
  }

  // ~~~~~~~~ Utilities ~~~~~~~~
  function getCurrentStudy(): {
    isNonStudy: boolean,
    study: STUDY_SIMPLE__DYNAMODB | undefined
  } {
    const key = 'currentStudy'
    const localStorageItem = localStorage.getItem(key) ?? ''

    if (localStorageItem === '') {
      return {
        isNonStudy: false,
        study: undefined,
      }
    } else {
      const currentStudy = JSON.parse(localStorageItem) as STUDY_SIMPLE__DYNAMODB
      return {
        isNonStudy: false,
        study: currentStudy,
      }
    }
  }



  const getUserData = (i: number): UserDataForVizType => {
    if (showComparison) {
      switch (i) {
        case 0:
        case 1:
        case 2:
          // return facetScores
          //   ? {
          //     facetScores: facetScores as FacetFactorType,
          //     domainScores: domainScores as SkillDomainFactorType,
          //   }
          //   : bessiSkillScores?.domainScores
          //     ? {
          //       facetScores: bessiSkillScores?.facetScores,
          //       domainScores: bessiSkillScores?.domainScores,
          //     }
          //     : calculateBessiScores[192](generateDummyBessiUserScores())

          if (facetScores) {
            return {
              facetScores: facetScores as FacetFactorType,
              domainScores: domainScores as SkillDomainFactorType,
            }
          } else {
            if (bessiSkillScores?.domainScores) {
              return {
                facetScores: bessiSkillScores?.facetScores,
                domainScores: bessiSkillScores?.domainScores,
              }
            } else {
              return calculateBessiScores[192](generateDummyBessiUserScores())
            }
          }
        default:
          return calculateBessiScores[192](generateDummyBessiUserScores())
      }
    } else {
      switch (i) {
        case 0:
          // Step 1: Prepare inputData (you've already done this)
          const stellarInputData: BarChartInputDataType = {
            facetScores: facetScores
              ? facetScores
              : (bessiSkillScores?.facetScores as FacetFactorType),
            domainScores: domainScores
              ? domainScores
              : (bessiSkillScores?.domainScores as SkillDomainFactorType),
          }

          // Step 2: Transform inputData to get barChartDataArray
          const stellarBarChartData: BarChartTargetDataType[] = transformData(
            domainScores 
              ? stellarInputData
              : bessiSkillScores?.domainScores
                ? stellarInputData
                : calculateBessiScores[192](generateDummyBessiUserScores())
          )

          // Step 3: Map over barChartDataArray to create stellarPlotData
          const stellarPlotData = stellarBarChartData.map(
            (d): { axis: string, value: number, barChartData: BarChartTargetDataType } => ({
              axis: d.name, // Domain name
              value: d.domainScore / 100, // Normalized domain score
              barChartData: d, // Detailed data for `BarChartPerDomain`
            })
          )

          console.log(`stellarPlotData: `, stellarPlotData)

          return stellarPlotData as StellarPlotDataType[]
        case 1:
        case 2:
          const inputData: BarChartInputDataType = {
            facetScores: facetScores 
              ? facetScores
              : bessiSkillScores?.facetScores as FacetFactorType,
            domainScores: domainScores
              ? domainScores
              : bessiSkillScores?.domainScores as SkillDomainFactorType,
          }

          return transformData(
            domainScores
              ? inputData
              : bessiSkillScores?.domainScores
                ? inputData
                : calculateBessiScores[192](generateDummyBessiUserScores())
          )
        case 3:
        case 4:
        case 5:
        case 6:
          // return facetScores
          //   ? {
          //     facetScores: facetScores as FacetFactorType,
          //     domainScores: domainScores as SkillDomainFactorType,
          //   }
          //   : bessiSkillScores?.domainScores
          //     ? {
          //       facetScores: bessiSkillScores?.facetScores,
          //       domainScores: bessiSkillScores?.domainScores,
          //     }
          //     : calculateBessiScores[192](generateDummyBessiUserScores())

          if (facetScores) {
            return {
              facetScores: facetScores as FacetFactorType,
              domainScores: domainScores as SkillDomainFactorType,
            }
          } else {
            if (bessiSkillScores?.domainScores) {
              return {
                facetScores: bessiSkillScores?.facetScores,
                domainScores: bessiSkillScores?.domainScores,
              }
            } else {
              return calculateBessiScores[192](generateDummyBessiUserScores())
            }
          }

        default:
          return calculateBessiScores[192](generateDummyBessiUserScores())
      }
    }
  }


  const renderVisualization = (
    isExample: boolean,
    i: number
  ) => {
    if (showComparison) {
      switch (i) {
        case 0:
          const { study, isNonStudy } = getCurrentStudy()

          const studyId: string | undefined = isNonStudy ? undefined : study?.id

          const histogramUserData = getUserData(i) as {
            facetScores: FacetFactorType,
            domainScores: SkillDomainFactorType,
          }


          return (
            <>
              <MultipleHistograms
                studyId={ studyId }
                isExample={ isExample }
                userData={ histogramUserData }
                email={ email }
                // auth0={{
                //   user,
                //   error,
                //   isLoading,
                // }}
              />
            </>
          )
        case 1:
          return (
            <>
              <DemoRidgelinePlot
                data={ RIDGELINE_DEMO_DOMAIN_DATA(100) }
                height={ 400 }
                width={ 800 }
              />
              <DemoRidgelinePlot
                data={ RIDGELINE_DEMO_FACET_DATA(100) }
                height={ 400 }
                width={ 800 }
              />
            </>
          )
        case 2:
          const multipleNormalPopFacetScores = getDummyPopulationBessiScores(100, 'facet')
          const multipleNormalPopDomainScores = getDummyPopulationBessiScores(100, 'domain')

          const multipleNormalIsSample = false

          const multipleNormalUserData = getUserData(i) as {
            facetScores: FacetFactorType,
            domainScores: SkillDomainFactorType,
            averages: SkillDomainFactorType,
          }

          const multipleNormalDistributionData: MultipleNormalDistributionDataType = {
            facetScores: multipleNormalUserData.facetScores,
            domainScores: multipleNormalUserData.domainScores,
            populationFacetScores: multipleNormalPopFacetScores,
            populationDomainScores: multipleNormalPopDomainScores,
          }

          return (
            <MultipleNormalDistributions
              isExample={ isExample }
              isSample={ multipleNormalIsSample }
              data={ multipleNormalDistributionData }
            />
          )
        default:
          return null
      }
    } else {
      switch (i) {
        case 0:
          const stellarPlotData = getUserData(i) as StellarPlotDataType[]
          return <StellarPlot isExample={ isExample } data={ stellarPlotData } />
        case 1:
          const barChartTitle = 'BESSI Bar Chart'
          const allData: BarChartTargetDataType[] = getUserData(i) as BarChartTargetDataType[]

          return (
            <>
              <Title isExample={ isExample } title={ barChartTitle } />

              { allData.map((data: BarChartTargetDataType, i: number) => (
                <>
                  <BarChartPerDomain isExample={ isExample } data={ data } />
                </>
              )) }
            </>
          )
        case 2:
          const radialBarChartTitle = `BESSI Radial Bar Chart`
          const _allData = getUserData(i) as BarChartTargetDataType[]

          return (
            <>
              <div
                style={ {
                  ...definitelyCenteredStyle,
                  flexDirection: 'column',
                } }
              >
                <Title isExample={ isExample } title={ radialBarChartTitle } />
                <select
                  value={ selectedRadialBarChart }
                  style={ {
                    padding: '4px 8px 4px 4px',
                    margin: '4px 0px 4px 0px',
                  } }
                  onChange={
                    (e: any) => handleOnChangeRadialBarChart(e)
                  }
                >
                  { _allData.map((data: BarChartTargetDataType, i: number) => (
                    <>
                      <option key={ i } value={ i }>
                        { data.name }
                      </option>
                    </>
                  )) }
                </select>

                <RadialBarChart
                  data={ _allData[selectedRadialBarChart] }
                  selectedRadialBarChart={ selectedRadialBarChart }
                />
              </div>
            </>
          )
        case 3:
          return <TreeMap isExample={ isExample } data={ getUserData(i) } />
        case 4:
          return (
            <PersonalityVisualization
              isExample={ isExample }
              data={ getUserData(i) }
            />
          )
        case 5:
          const mean = 50
          const stddev = getRandomValueInRange(1, 5)
          const score = getRandomValueInRange(50 - stddev, 50 + stddev)

          console.log(`[${new Date().toLocaleString()}] stddev: `, stddev)

          return (
            <SingleNormalDistributionChart
              mean={ mean }
              stddev={ stddev }
              score={ score }
            />
          )
        default:
          return null
      }
    }
  }


  // ------------------------------ Async functions ----------------------------
  async function handleRateVisualization(
    e: any, 
    positiveOrNegative: 'positive' | 'negative',
  ) {
    setIsRating(true)

    const rating = positiveOrNegative === 'positive' ? 1 : 0
    const vizName = visualizations[currentVisualization].name

    // Submit the user's rating of the visualization to DynamoDB
    const userVizRatingId = await storeRatingInDynamoDB(rating, vizName)
  }


  // ---------------------------------- Hooks ----------------------------------
  async function storeRatingInDynamoDB(
    rating: number, 
    vizName: string
  ) {
    const { study, isNonStudy } = getCurrentStudy()

    let userVizRating: Omit<RATINGS__DYNAMODB, "id">
    
    /**
     * @dev This is the object that we store in DynamoDB using AWS's
     * `PutItemCommand` operation.
     */
    if (isNonStudy) {
      userVizRating = {
        email: email ?? '',
        rating,
        vizName,
        timestamp: 0,
      }
    } else {
      userVizRating = {
        email: email ?? '',
        study,
        rating,
        vizName,
        timestamp: 0,
      }
    }


    try {
      const response = await fetch('/api/v1/assessment/viz-rating', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userVizRating,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const userVizRatingId = json.userVizRatingId
        return userVizRatingId
      } else {
        setIsRating(false)

        const error = `Error posting ${ 'viz rating' } to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setIsRating(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)
    }
  }

  
  // ---------------------------------- Hooks ----------------------------------
  useClickOutside(modalRef, () => setIsModalVisible(false))

  useEffect(() => {
    setIsRating(false)
  }, [ currentVisualization ])

  useLayoutEffect(() => {
    // if (!isLoading && user && user.email) {
    if (email) {
      // Do nothing if Auth0 found the user's email
    // } else if (!isLoading && !user) {
    } else {
      // // Silently log the error to the browser's console
      // console.error(
      //   `Auth0 couldn't get 'user' from useUser(): `,
      //   error
      // )

      console.error(`Couldn't get the user's email`)
    }
  }, [ /* isLoading */ email ])




  return (
    <>
      <div style={{ marginTop: '24px' }}>
        {/* Data Viz Options - Row */}
        <div 
          style={{
            ...definitelyCenteredStyle,
            position: 'relative',
            marginTop: '-12px',
          }}
        >
          {/* Toggle Switch */ }
          <div className={ styles.switchOuterContainer }>
            <div className={ styles.switchInnerContainer }>
              <span style={{ fontSize: '13px', marginRight: '4px' }}>
                <div style={ { display: 'flex' } }>
                  <Image
                    width={ '24' }
                    height={ '24' }
                    src={ '/icons/svg/group.svg' }
                    alt={ 'icon to toggle group comparison' }
                    style={{
                      filter: 'drop-shadow(0px 1.25px 1.5px rgba(0, 0, 0, 0.85))',
                    }}
                  />
                </div>
              </span>
              <label className={ styles.switch }>
                <input 
                  type='checkbox'
                  checked={ showComparison }
                  onChange={ handleToggleVisualizationType }
                />
                <span className={ styles.slider } />
              </label>
            </div>
          </div>
        </div>

        <TitleDropdown
          visualizations={ visualizations }
          currentVisualization={ currentVisualization }
          setCurrentVisualization={ setCurrentVisualization }
        />

        { isExample
          ? renderVisualization(isExample, currentVisualization)
          : (
            <>
              <ShareResults
                state={ {
                  isCopied: isCopied,
                  isRating: isRating,
                } }
                onClick={ {
                  handleTakeScreenshot,
                  handleRateVisualization,
                } }
              />

              <UserVisualization
                screenshot1Ref={ screenshot1Ref }
                isExample={ isExample as boolean }
                bessiSkillScores={ bessiSkillScores }
                renderVisualization={ renderVisualization }
                currentVisualization={ currentVisualization }
                rateUserResults={ rateUserResults as boolean }
              />
            </>
          )
        }
        
        <ResultsVisualizationModal
          screenshotUrl={ screenshotUrl }
          refs={{ 
            modalRef, 
            screenshot2Ref 
          }}
          viz={{
            visualizations, 
            currentVisualization 
          }}
          state={{
            isCopied,
            setIsCopied, 
            isModalVisible 
          }}
        />


        { rateUserResults && (
          <>
            <BessiRateUserResults bessiSkillScores={ bessiSkillScores } />
          </>
        ) }

      </div>
    </>
  )
}

export default BessiResultsVisualization