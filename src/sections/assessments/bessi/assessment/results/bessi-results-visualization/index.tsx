'use client'

// Externals
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import html2canvas from 'html2canvas'
// Locals
// Sections
import TitleDropdown from './title-dropdown'
import UserVisualization from './user-visualization'
// Components
import Title from '@/components/DataViz/Title'
import TreeMap from '@/components/DataViz/TreeMap'
import StellarPlot from '@/components/DataViz/StellarPlot'
import ShareResults from '@/components/DataViz/ShareResults'
import RadialBarChart from '@/components/DataViz/BarChart/Radial'
import BarChartPerDomain from '@/components/DataViz/BarChart/PerDomain'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import NormalDistributionChart from '@/components/DataViz/Distributions/Normal'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
import ResultsVisualizationModal from '@/components/Modals/BESSI/ResultsVisualization'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Utils
import {
  transformData,
  dummyVariables,
  FacetFactorType,
  RATINGS__DYNAMODB,
  InputDataStructure,
  TargetDataStructure,
  BessiSkillScoresType,
  SkillDomainFactorType,
  StudySimple__DynamoDB,
  AVAILABLE_ASSESSMENTS,
  getRandomValueInRange,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'




type BessiResultsVisualizationType = {
  isExample?: boolean
  rateUserResults?: boolean
}


export type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScoresType | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScoresType | null>>
}




const BessiResultsVisualization: FC<BessiResultsVisualizationType> = ({
  isExample,
  rateUserResults
}) => {
  // Contexts
  const {
    email,
    username,
  } = useContext(AuthenticatedUserContext)
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
          ?? dummyVariables.pv.data?.domainScores as SkillDomainFactorType
        ).map(([key, value]) => ({
          axis: key,
          value: value / 100
        }))
      case 1:
      case 2:
        const inputData: InputDataStructure = {
          facetScores: bessiSkillScores?.facetScores as FacetFactorType,
          domainScores: bessiSkillScores?.domainScores as SkillDomainFactorType,
        }

        return transformData(
          bessiSkillScores?.domainScores
            ? inputData 
            : dummyVariables.pv.data
          )
      case 3:
      case 4:
      case 5:
        return bessiSkillScores?.domainScores
          ? {
            facetScores: bessiSkillScores?.facetScores,
            domainScores: bessiSkillScores?.domainScores,
            averages: dummyVariables.pv.averages,
          }
          : dummyVariables.pv.data
      default:
        return dummyVariables.pv.data
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
        const allData: TargetDataStructure[] = data_(i) as TargetDataStructure[]

        return (
          <>
            <Title isExample={ isExample } title={ barChartTitle } />

            { allData.map((data: TargetDataStructure, i: number) => (
              <>
                <BarChartPerDomain isExample={ isExample } data={ data } />
              </>
            )) }
          </>
        )
      case 2:
        const radialBarChartTitle = `BESSI Radial Bar Chart`
        const _allData = data_(i) as TargetDataStructure[]

        return (
          <>
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
              { _allData.map((data: TargetDataStructure, i: number) => (
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
          <NormalDistributionChart
            mean={ mean }
            stddev={ stddev }
            score={ score }
          />
        )
      case 5:
        return (
          <PersonalityVisualization
            isExample={ isExample }
            data={ data_(i) }
            averages={ dummyVariables.pv.averages }
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
      if (email === undefined) {
        /**
         * @todo Replace the line below by handling the error on the UI here
         */
        throw new Error(`Error getting email from cookie!`)
      } else {
        let study: {
          id: string
          name: string
        } | StudySimple__DynamoDB = AVAILABLE_ASSESSMENTS.filter(
          item => item.id === 'bessi'
        )[0]

        study = {
          name: study.name,
          assessmentId: study.id
        } as StudySimple__DynamoDB

        /**
         * @dev This is the object that we store in DynamoDB using AWS's
         * `PutItemCommand` operation.
         */
        const userVizRating: Omit<RATINGS__DYNAMODB, "id"> = {
          email,
          username,
          study,
          rating,
          vizName,
          timestamp: 0,
        }

        try {
          const response = await fetch('/api/assessment/viz-rating', {
            method: 'POST',
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
        style={ { 
          marginTop: '24px',
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        } }
      >
        <TitleDropdown
          visualizations={ visualizations }
          currentVisualization={ currentVisualization }
          setCurrentVisualization={ setCurrentVisualization }
        />
        

        { isExample
          ? renderVisualization(isExample, currentVisualization)
          : (
            <Fragment>
              <ShareResults
                state={{
                  isCopied: isCopied,
                  isRating: isRating,
                }}
                onClick={{
                  handleTakeScreenshot,
                  handleRateVisualization,
                }}
              />

              <UserVisualization
                screenshot1Ref={ screenshot1Ref }
                isExample={ isExample as boolean }
                bessiSkillScores={ bessiSkillScores }
                renderVisualization={ renderVisualization }
                currentVisualization={ currentVisualization }
                rateUserResults={ rateUserResults as boolean }
              />
            </Fragment>
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