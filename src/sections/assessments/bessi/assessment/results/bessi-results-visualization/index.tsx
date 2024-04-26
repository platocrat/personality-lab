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

  /**
   * @dev 1. Use access token to create a share button
   *      2. Share button exposes a hidden custom URL with the user's access 
   *         token of the user's results. 
   *      3. User can click second button to copy the URL with user's exposed
   *         access token in that URL which can shared with others.
   *      4. URL with access token of user's results is used to privately view 
   *         the user's results by any user. 
   *      5. Access token of user's results is only active for 2 hours until it
   *         is refreshed.
   */


  
  const title = visualizations[currentVisualization].name
  const liStyle = { padding: '8px 20px', cursor: 'pointer' }

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
        return <BarChart data={ data_ } />
      case 2:
        return <TreeMap data={ data_ } />
      case 3:
        return <PersonalityVisualization
          data={ data_ }
          averages={ null }
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