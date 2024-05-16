'use client'

// Externals
import { 
  FC, 
  useRef, 
  Fragment, 
  Dispatch, 
  useState, 
  useEffect,
  useContext, 
  SetStateAction, 
} from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
// Locals
// Sections
import Modal from './modal'
import TitleDropdown from './title-dropdown'
import BessiShareResults from './share-results'
import UserVisualization from './user-visualization'
// Components
import Title from '@/components/DataViz/Title'
import TreeMap from '@/components/DataViz/TreeMap'
import StellarPlot from '@/components/DataViz/StellarPlot'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import BarChartPerDomain from '@/components/DataViz/BarChart/BarChartPerDomain'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
// Hooks
import useClickOutside from '@/app/hooks/useClickOutside'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utils
import { 
  imgPaths,
  transformData,
  dummyVariables, 
  FacetFactorType, 
  InputDataStructure,
  TargetDataStructure,
  BessiSkillScoresType, 
  SkillDomainFactorType,
} from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
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
    { id: 0, name: 'Stellar Plot', imgName: 'stellar-plot' },
    { id: 1, name: 'Bar Graph', imgName: 'bar-graph ' },
    { id: 2, name: 'Tree Map', imgName: 'tree-map' },
    { id: 3, name: 'Personality Visualization', imgName: 'personality-visualization' },
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


  const handleRateVisualization = (e: any) => {
    const { value } = e.target

    setIsRating(true)
    
    // Submit the user's rating of the visualization to DynamoDB
    // await storeRatingInDynamoDB
  }


  // ---------------------------------- Hooks ----------------------------------
  async function storeRatingInDynamoDB(rating) {
    
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
              <BessiShareResults
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

        
        <Modal
          modalRef={ modalRef }
          isCopied={ isCopied }
          setIsCopied={ setIsCopied }
          screenshotUrl={ screenshotUrl }
          isModalVisible={ isModalVisible }
          screenshot2Ref={ screenshot2Ref }
          visualizations={ visualizations }
          currentVisualization={ currentVisualization }
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