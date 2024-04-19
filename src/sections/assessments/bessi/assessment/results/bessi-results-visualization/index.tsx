'use client'

// Externals
import { 
  FC, 
  Fragment, 
  Dispatch, 
  useState,
  useContext, 
  SetStateAction, 
} from 'react'
import Image from 'next/image'
// Locals
import TreeMap from '@/components/DataViz/TreeMap'
import BarChart from '@/components/DataViz/BarChart'
import StellarPlot from '@/components/DataViz/StellarPlot'
import PersonalityVisualization from '@/components/DataViz/PersonalityVisualization'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Constants
import { dummyVariables } from '@/utils/bessi/constants'
// Enums
import { SkillDomain } from '@/utils/bessi/types/enums'
// Types
import { BessiSkillScores, SkillDomainFactorType } from '@/utils/bessi/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/bess-results-visualization.module.css'



type BessiResultsVisualizationType = {
  data?: BessiSkillScores
}


type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScores | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScores | null>>
}



const BessiResultsVisualization: FC<BessiResultsVisualizationType> = ({ data }) => {
  // Contexts
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  // Current visualization state
  const [ isOpen, setIsOpen ] = useState(false)
  const [ currentVisualization, setCurrentVisualization ] = useState(0)
  
  const visualizations = [
    { id: 0, name: 'Stellar Plot' },
    { id: 1, name: 'Bar Graph' },
    { id: 2, name: 'Tree Map' },
    { id: 3, name: 'Personality Visualization' },
  ]

  const title = visualizations[currentVisualization].name
  const liStyle = { padding: '8px 20px', cursor: 'pointer' }

  const data_ = Object.entries(
    dummyVariables.pv.data?.domainScores as SkillDomainFactorType
  ).map(([key, value]) => ({
    axis: key,
    value: value / 100
  }))

  // ------------------------- Regular functions -------------------------------
  // Placeholder for rendering the selected visualization
  const renderVisualization = (i: number) => {
    switch (i) {
      case 0:
        return <StellarPlot data={ data_ } />
      case 1:
        /**
         * @todo Fix `data` property so that we have consistency across all
         * components in this switch -- change `d.metrics` to something like
         * `d.axis` and `d.values`
         */
        return <BarChart data={ dummyVariables.pv.data } />
      case 2:
        return <TreeMap data={ dummyVariables.pv.data } />
      case 3:
        return <PersonalityVisualization
          data={ dummyVariables.pv.data }
          averages={ dummyVariables.pv.averages }
        />
      default:
        return null
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
              cursor: 'pointer',
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
                src={ '/icons/down-arrow-icon.png' }
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

        { renderVisualization(currentVisualization) }

      </div>
    </>
  )
}

export default BessiResultsVisualization