'use client'

// Externals
import {
  FC,
  useRef,
  useState,
  useEffect,
  useContext,
  } from 'react'
  import html2canvas from 'html2canvas'
  import { useUser } from '@auth0/nextjs-auth0/client'
  // Locals
  // Sections
import TitleDropdown from './title-dropdown'
import UserVisualization from './user-visualization'
// Components
import RadialBarChart from '@/components/DataViz/BarChart/Radial'
import DemoRidgelinePlot from '@/components/DataViz/DemoRidgeline'
import BarChartPerDomain from '@/components/DataViz/BarChart/PerDomain'
import {
  RIDGELINE_DEMO_DOMAIN_DATA,
  RIDGELINE_DEMO_FACET_DATA,
} from '@/components/DataViz/DemoRidgeline/data'
import MultipleNormalDistributions, {
  MultipleNormalDistributionDataType
} from '@/components/DataViz/Distributions/Normal/MultipleNormal'
import Title from '@/components/DataViz/Title'
import TreeMap from '@/components/DataViz/TreeMap'
import StellarPlot from '@/components/DataViz/StellarPlot'
import ShareResults from '@/components/DataViz/ShareResults'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
import ResultsVisualizationModal from '@/components/Modals/BESSI/ResultsVisualization'
import SingleNormalDistributionChart from '@/components/DataViz/Distributions/Normal/SingleNormal'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Context Types
import {
  BessiSkillScoresContextType
} from '@/contexts/types'
// Utils
import {
  transformData,
  FacetFactorType,
  RATINGS__DYNAMODB,
  dummyUserBessiScores,
  SkillDomainFactorType,
  getRandomValueInRange,
  BarChartInputDataType,
  BarChartTargetDataType,
  STUDY_SIMPLE__DYNAMODB,
  getDummyPopulationBessiScores,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'




type BessiResultsVisualizationType = {
  isExample?: boolean
  rateUserResults?: boolean
}




const BessiResultsVisualization: FC<BessiResultsVisualizationType> = ({
  isExample,
  rateUserResults
}) => {
  // Auth0
  const { user } = useUser()
  // Contexts
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
  const [ isModalVisible, setIsModalVisible ] = useState(false)
  // Strings
  const [ screenshotUrl, setScreenshotUrl ] = useState('')
  // Numbers
  const [ 
    selectedRadialBarChart, 
    setSelectedRadialBarChart 
  ] = useState(0)
  const [ currentVisualization, setCurrentVisualization ] = useState(0)

  
  const visualizations = [
    { name: 'Stellar Plot', imgName: 'stellar-plot' },
    { name: 'Bar Graph', imgName: 'bar-graph ' },
    { name: 'Radial Bar Graph', imgName: 'radial-bar-graph' },
    { name: 'Tree Map', imgName: 'tree-map' },
    { name: 'Normal Distribution', imgName: 'normal-distribution' },
    { name: 'Multiple Normal Distributions Demo', imgName: 'multiple-normal-distributions-demo' },
    { name: 'Ridgeline Plot Demo', imgName: 'ridgeline-plot-demo' },
    { name: 'Personality Visualization', imgName: 'personality-visualization' },
  ]
  
  
  // ------------------------- Regular functions -------------------------------
  function handleOnChangeRadialBarChart(e: any) {
    const { value } = e.target
    setSelectedRadialBarChart(value)
  }


  const data_ = (i: number) => {
    switch (i) {
      case 0:
        return Object.entries(
          bessiSkillScores?.domainScores as SkillDomainFactorType
          ?? dummyUserBessiScores.domainScores as SkillDomainFactorType
        ).map(([key, value]) => ({
          axis: key,
          value: value / 100
        }))
      case 1:
      case 2:
        const inputData: BarChartInputDataType = {
          facetScores: bessiSkillScores?.facetScores as FacetFactorType,
          domainScores: bessiSkillScores?.domainScores as SkillDomainFactorType,
        }

        return transformData(
          bessiSkillScores?.domainScores
            ? inputData 
            : dummyUserBessiScores
          )
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return bessiSkillScores?.domainScores
          ? {
            facetScores: bessiSkillScores?.facetScores,
            domainScores: bessiSkillScores?.domainScores,
            averages: dummyUserBessiScores.domainScores,
          }
          : dummyUserBessiScores
      default:
        return dummyUserBessiScores
    }
  }


  // Placeholder for rendering the selected visualization
  const renderVisualization = (
    isExample: boolean, 
    i: number
  ) => {
    switch (i) {
      case 0:
        return <StellarPlot isExample={ isExample } data={ data_(i) } />
      case 1:
        const barChartTitle = 'BESSI Bar Chart'
        const allData: BarChartTargetDataType[] = data_(i) as BarChartTargetDataType[]

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
        const _allData = data_(i) as BarChartTargetDataType[]

        return (
          <>
            <div
              style={{
                ...definitelyCenteredStyle,
                flexDirection: 'column',
              }}
            >
              <Title isExample={ isExample } title={ radialBarChartTitle } />
              <select
                value={ selectedRadialBarChart }
                style={{ 
                  padding: '4px 8px 4px 4px',
                  margin: '4px 0px 4px 0px',
                }}
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
        return <TreeMap isExample={ isExample } data={ data_(i) } />
      case 4:
        /**
         * @todo Get `mean` from data 
         */
        const mean = 50
        /**
         * @todo Get `stddev` from data 
         */
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
      case 5:
        /**
         * @todo If `isExample` is false, replace dummy data with real data
         */
        const multipleNormalPopFacetScores = getDummyPopulationBessiScores(100, 'facet')
        const multipleNormalPopDomainScores = getDummyPopulationBessiScores(100, 'domain')

        const multipleNormalIsSample = false

        const multipleNormalUserData = data_(i) as {
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
            isSample={ multipleNormalIsSample }
            isExample={ isExample }
            data={ multipleNormalDistributionData }
          />
        )
      case 6:
        /**
         * @todo If `isExample` is false, replace dummy data with real data
         */
        // const ridgelinePlotPopFacetScores = getDummyPopulationBessiScores(100, 'facet')
        // const ridgelinePlotPopDomainScores = getDummyPopulationBessiScores(100, 'domain')

        // const ridgelinePlotIsSample = false

        // const ridgelinePlotUserData = data_(i) as {
        //   facetScores: FacetFactorType,
        //   domainScores: SkillDomainFactorType,
        //   averages: SkillDomainFactorType,
        // }

        // const ridgelinePlotData: RidgelinePlotDataType = {
        //   facetScores: ridgelinePlotUserData.facetScores,
        //   domainScores: ridgelinePlotUserData.domainScores,
        //   populationFacetScores: ridgelinePlotPopFacetScores,
        //   populationDomainScores: ridgelinePlotPopDomainScores,
        // }

        return (
          <>
            {/* <RidgelinePlot
              isSample={ ridgelinePlotIsSample }
              isExample={ isExample }
              data={ ridgelinePlotData }
            /> */}
            <DemoRidgelinePlot
              data={ RIDGELINE_DEMO_DOMAIN_DATA }
              height={ 400 }
              width={ 800 }
            />
            <DemoRidgelinePlot
              data={ RIDGELINE_DEMO_FACET_DATA }
              height={ 400 }
              width={ 800 }
            />
          </>
        )
      case 7:
        return (
          <PersonalityVisualization
            isExample={ isExample }
            data={ data_(i) }
            averages={ dummyUserBessiScores.domainScores }
          />
        )
      default:
        return null
    }
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


  async function handleRateVisualization (
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
      if (user?.email) {
        /**
         * @todo Replace the line below by handling the error on the UI here
         */
        throw new Error(`Error getting email from cookie!`)
      } else {
        const localStorageItem = localStorage.getItem('currentStudy') as string ?? ''
        const study = JSON.parse(localStorageItem) as STUDY_SIMPLE__DYNAMODB

        /**
         * @dev This is the object that we store in DynamoDB using AWS's
         * `PutItemCommand` operation.
         */
        const userVizRating: Omit<RATINGS__DYNAMODB, "id"> = {
          email: user?.email ?? '',
          study,
          rating,
          vizName,
          timestamp: 0,
        }

        try {
          const response = await fetch('/api/assessment/viz-rating', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userVizRating }),
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
  }

  
  // ---------------------------------- Hooks ----------------------------------
  useClickOutside(modalRef, () => setIsModalVisible(false))

  
  useEffect(() => {
    setIsRating(false)
  }, [ currentVisualization ])




  return (
    <>
      <div 
        style={{ marginTop: '24px' }}
      >
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