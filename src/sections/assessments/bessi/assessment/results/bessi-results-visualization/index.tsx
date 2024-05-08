'use client'

// Externals
import { 
  FC, 
  useRef,
  useMemo,
  Fragment, 
  Dispatch, 
  useState,
  useEffect,
  useContext, 
  SetStateAction,
  MutableRefObject,
} from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
// Locals
import Modal from './modal'
import TitleDropdown from './title-dropdown'
import UserVisualization from './user-visualization'
// Components
import TreeMap from '@/components/DataViz/TreeMap'
import Spinner from '@/components/Suspense/Spinner'
import StellarPlot from '@/components/DataViz/StellarPlot'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import BarChartPerDomain from '@/components/DataViz/BarChart/BarChartPerDomain'
import BessiShareResultsButton from '@/components/Buttons/BESSI/ShareResultsButton'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Constants
import { dummyVariables, imgPaths } from '@/utils/bessi/constants'
// Enums
import { SkillDomain } from '@/utils/bessi/types/enums'
// Types
import { 
  BessiSkillScoresType, 
  FacetFactorType, 
  SkillDomainFactorType 
} from '@/utils/bessi/types'
import {
  transformData,
  InputDataStructure,
  TargetDataStructure,
} from '@/components/DataViz/BarChart/GroupedBarChart'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/bess-results-visualization.module.css'



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
  const handleClickOutside = (e: any) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalVisible(false)
    }
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
        return bessiSkillScores?.domainScores
          ? {
            facetScores: bessiSkillScores?.facetScores,
            domainScores: bessiSkillScores?.domainScores,
            averages: dummyVariables.pv.averages,
          }
          : dummyVariables.pv.data
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
        const allData: TargetDataStructure[] = data_(i) as TargetDataStructure[]

        return (
          <>
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

  
  useEffect(() => {
    // Only add the event listener when the dropdown is visible
    if (isModalVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalVisible])




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
              <div
                style={{
                  ...definitelyCenteredStyle,
                  gap: '12px',
                  marginBottom: '8px',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  style={ {
                    width: '50px',
                    fontSize: '12.5px',
                    padding: '8px 12px',
                    margin: '12px 0px 12px 0px',
                    backgroundColor: isCopied ? 'rgb(18, 215, 67)' : ''
                  } }
                  className={ appStyles.button }
                  onClick={ handleTakeScreenshot }
                >
                  <Image
                    width={ 18 }
                    height={ 18 }
                    alt='Share icon to share data visualization'
                    className={ styles.img }
                    src={
                      isCopied 
                        ? `${ imgPaths().svg }white-checkmark.svg` 
                        : `${ imgPaths().svg }white-share-icon.svg`
                    }
                  />
                </button>
              </div>

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