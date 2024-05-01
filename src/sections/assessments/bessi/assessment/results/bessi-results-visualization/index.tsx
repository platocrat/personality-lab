'use client'

// Externals
import { 
  FC, 
  useRef,
  useMemo,
  Fragment, 
  Dispatch, 
  useState,
  useContext, 
  SetStateAction,
  MutableRefObject,
} from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
// Locals
import TreeMap from '@/components/DataViz/TreeMap'
import Spinner from '@/components/Suspense/Spinner'
import BarChart from '@/components/DataViz/BarChart'
import StellarPlot from '@/components/DataViz/StellarPlot'
import BessiRateUserResults from '@/components/Forms/BESSI/RateUserResults'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Constants
import { dummyVariables } from '@/utils/bessi/constants'
// Enums
import { SkillDomain } from '@/utils/bessi/types/enums'
// Types
import { 
  BessiSkillScoresType, 
  SkillDomainFactorType 
} from '@/utils/bessi/types'
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


type UserVisualizationType = {
  rateUserResults: boolean
  currentVisualization: number
  screenshotRef: MutableRefObject<any>
  bessiSkillScores: BessiSkillScoresType | null
  renderVisualization: (i: number) => JSX.Element | null
}



const imgPath = `/icons/png/`





const UserVisualization: FC<UserVisualizationType> = ({
  screenshotRef,
  rateUserResults,
  bessiSkillScores,
  renderVisualization,
  currentVisualization,
}) => {
  return (
    <>
      { bessiSkillScores?.domainScores
        ? (
          <>
            <div ref={ screenshotRef }>
              { renderVisualization(currentVisualization) }
            </div>
          </>
        ) : (
          <>
            <div style={ { ...definitelyCenteredStyle,margin: '24px' } }>
              <Spinner height='72' width='72' />
            </div>
          </>
        )
      }
    </>
  )
}





const BessiResultsVisualization: FC<BessiResultsVisualizationType> = ({
  isExample,
  rateUserResults
}) => {
  // Contexts
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )

  // States
  const screenshotRef = useRef<any>(null)
  const [ isOpen, setIsOpen ] = useState(false)
  const [ currentVisualization, setCurrentVisualization ] = useState(0)
  
  const visualizations = [
    { id: 0, name: 'Stellar Plot', imgName: 'stellar-plot' },
    { id: 1, name: 'Bar Graph', imgName: 'bar-graph '},
    { id: 2, name: 'Tree Map', imgName: 'tree-map' },
    { id: 3, name: 'Personality Visualization', imgName: 'personality-visualization' },
  ]
  
  const title = visualizations[currentVisualization].name
  const liStyle = { padding: '8px 20px', cursor: 'pointer' }


  // ------------------------- Regular functions -------------------------------
  const data_ = (i: number) => {
    let _ = i === 0 // if i === 0
      ? Object.entries(
        bessiSkillScores?.domainScores as SkillDomainFactorType
        ?? dummyVariables.pv.data?.domainScores as SkillDomainFactorType
      ).map(([key, value]) => ({
        axis: key,
        value: value / 100
      }))
      // if i !== 0 && domainScores !== undefined
      : bessiSkillScores?.domainScores
        ? {
          facetScores: bessiSkillScores?.facetScores,
          domainScores: bessiSkillScores?.domainScores,
          averages: dummyVariables.pv.averages,
        }
        : dummyVariables.pv.data

    return _
  }

  // Placeholder for rendering the selected visualization
  const renderVisualization = (i: number) => {
    switch (i) {
      case 0:
        return <StellarPlot data={ data_(i) } />
      case 1:
        /**
         * @todo Fix `data` property so that we have consistency across all
         * components in this switch -- change `d.metrics` to something like
         * `d.axis` and `d.values`
         */
        return <BarChart data={ data_(i) } />
      case 2:
        return <TreeMap data={ data_(i) } />
      case 3:
        return <PersonalityVisualization
          data={ data_(i) }
          averages={ dummyVariables.pv.averages }
        />
      default:
        return null
    }
  }


  const handleTakeScreenshot = () => {
    if (screenshotRef.current) {

      html2canvas(screenshotRef.current).then((canvas: any) => {
        

        canvas.toBlob((blob: any) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')

            link.href = url
            link.download = `${ visualizations[currentVisualization].imgName }.png`
            link.click()

            // Cleanup: revoke the object URL after download
            URL.revokeObjectURL(url)
          }
        }, 'image/png')
      })
    }
  }

  // ------------------------- Async functions ---------------------------------
  async function handleSelection (vizId: number) {
    setCurrentVisualization(vizId)
    setIsOpen(false)  // close the dropdown after selection
  }

  async function toggleDropdown () {
    setIsOpen(!isOpen)
  }



  return (
    <>
      <div 
        style={ { 
          marginTop: '24px',
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        } }
      >
        <div 
          style={ { 
            ...definitelyCenteredStyle,
            position: 'relative', 
            textAlign: 'center' 
          } }
        >
          <button
            onClick={ toggleDropdown }
            style={{
              border: 'none',
              outline: 'none',
              display: 'flex',
              cursor: 'pointer',
              flexDirection: 'row',
              background: 'transparent',
            }}
          >
            <h3
              style={ { fontSize: '18px', }}
              className={ styles.dropdownTitle }
            >
              { title }
              <Image
                width={ 12 }
                height={ 12 }
                alt='Dropdown-arrow-icon'
                className={ `${styles.dropdownIcon} ${isOpen ? styles.rotated : ''}` }
                src={ `${ imgPath }down-arrow-icon.png` }
              />
            </h3>
          </button>

          { isOpen && (
            <ul className={ styles.dropdown }>
              { visualizations.map((viz, i) => (
                <Fragment key={ `viz-option-${i}` }>
                  <li 
                    style={ liStyle } 
                    className={ styles.dropdownItem }
                    onClick={ () => handleSelection(viz.id) }
                  >
                    { viz.name }
                  </li>
                </Fragment>
              )) }
            </ul>
          ) }
        </div>

        <button
          style={ {
            fontSize: '12.5px',
            margin: '12px 0px 12px 0px',
            width: '125px',
          } }
          className={ appStyles.button } 
          onClick={ handleTakeScreenshot }
        >
          { `Download as PNG` }
        </button>

        
        { isExample
          ? renderVisualization(currentVisualization)
          : (
            <UserVisualization
              screenshotRef={ screenshotRef }
              bessiSkillScores={ bessiSkillScores }
              renderVisualization={ renderVisualization }
              currentVisualization={ currentVisualization }
              rateUserResults={ rateUserResults as boolean }
            />
          )
        }

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