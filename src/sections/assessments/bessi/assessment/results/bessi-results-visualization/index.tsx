'use client'

// Externals
import html2canvas from 'html2canvas'
import {
  FC,
  useRef,
  useState,
  Fragment,
  Dispatch,
  useContext,
  SetStateAction,
} from 'react'
// Locals
// Sections
import TitleDropdown from './title-dropdown'
import UserVisualization from './user-visualization'
// Components
import Title from '@/components/DataViz/Title'
import TreeMap from '@/components/DataViz/TreeMap'
import StellarPlot from '@/components/DataViz/StellarPlot'
import ShareResults from '@/components/DataViz/ShareResults'
import RateUserResults from '@/components/Forms/BESSI/RateUserResults'
import NormalDistributionChart from '@/components/DataViz/Distributions/Normal'
import BarChartPerDomain from '@/components/DataViz/BarChart/BarChartPerDomain'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
import ResultsVisualizationModal from '@/components/Modals/BESSI/ResultsVisualization'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utils
import {
  transformData,
  dummyVariables,
  FacetFactorType,
  InputDataStructure,
  TargetDataStructure,
  BessiSkillScoresType,
  getRandomValueInRange,
  SkillDomainFactorType,
  getUsernameAndEmailFromCookie,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'




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
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  
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
  const [ currentVisualization, setCurrentVisualization ] = useState(0)

  
  const visualizations = [
    { name: 'Stellar Plot', imgName: 'stellar-plot' },
    { name: 'Bar Graph', imgName: 'bar-graph ' },
    { name: 'Tree Map', imgName: 'tree-map' },
    { name: 'Personality Visualization', imgName: 'personality-visualization' },
    { name: 'Normal Distribution', imgName: 'normal-distribution' },
  ]
  
  
  // ------------------------- Regular functions -------------------------------
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
        const inputData: InputDataStructure = {
          facetScores: bessiSkillScores?.facetScores as FacetFactorType,
          domainScores: bessiSkillScores?.domainScores as SkillDomainFactorType,
        }

        return transformData(
          bessiSkillScores?.domainScores
            ? inputData 
            : dummyVariables.pv.data
          )
      case 2:
      case 3:
        return bessiSkillScores?.domainScores
          ? {
            facetScores: bessiSkillScores?.facetScores,
            domainScores: bessiSkillScores?.domainScores,
            averages: dummyVariables.pv.averages,
          }
          : dummyVariables.pv.data
      case 4:
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
        const title = 'BESSI Bar Chart'
        const allData: TargetDataStructure[] = data_(i) as TargetDataStructure[]

        return (
          <>
            <div style={{ margin: '24px 0px 0px 0px' }} />
            <Title isExample={ isExample } title={ title } />

            { allData.map((data: TargetDataStructure, i: number) => (
              <>
                <BarChartPerDomain isExample={ isExample } data={ data } />
              </>
            )) }
          </>
        )
      case 2:
        return <TreeMap isExample={ isExample } data={ data_(i) } />
      case 3:
        return (
          <PersonalityVisualization
            isExample={ isExample }
            data={ data_(i) }
            averages={ dummyVariables.pv.averages }
          />
        )
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



        console.log(`[${new Date().toLocaleString() }] stddev: `, stddev)

        return (
          <NormalDistributionChart
            mean={ mean }
            stddev={ stddev }
            score={ score }
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
      const CURRENT_TIMESTAMP = new Date().getTime()

      const { email, username } = await getUsernameAndEmailFromCookie()


      if (email === undefined) {
        /**
         * @todo Replace the line below by handling the error on the UI here
         */
        throw new Error(`Error getting email from cookie!`)
      } else {
        /**
         * @dev This is the object that we store in DynamoDB using AWS's
         * `PutItemCommand` operation.
         */
        const userVizRating/*: BESSI__VisualizationRating__DynamoDB */ = {
          email: email,
          username: username,
          timestamp: CURRENT_TIMESTAMP,
          vizName: vizName,
          rating: rating,
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
            const userVizRatingId = json.data
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