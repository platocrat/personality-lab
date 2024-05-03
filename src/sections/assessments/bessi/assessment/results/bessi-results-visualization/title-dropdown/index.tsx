// Externals
import Image from 'next/image'
import { Fragment, useState } from 'react'
// Locals
import { imgPaths } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/bess-results-visualization.module.css'



const liStyle = { padding: '8px 20px', cursor: 'pointer' }




const TitleDropdown = ({
  visualizations,
  currentVisualization,
  setCurrentVisualization,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const title = visualizations[currentVisualization].name


  // ------------------------- Async functions ---------------------------------
  async function handleSelection(vizId: number) {
    setCurrentVisualization(vizId)
    setIsOpen(false)  // close the dropdown after selection
  }

  async function toggleDropdown() {
    setIsOpen(!isOpen)
  }



  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          position: 'relative',
          textAlign: 'center'
        } }
      >
        <button
          onClick={ toggleDropdown }
          style={ {
            border: 'none',
            outline: 'none',
            display: 'flex',
            cursor: 'pointer',
            flexDirection: 'row',
            background: 'transparent',
          } }
        >
          <h3
            style={ { fontSize: '18px', } }
            className={ styles.dropdownTitle }
          >
            { title }
            <Image
              width={ 12 }
              height={ 12 }
              alt='Dropdown-arrow-icon'
              className={ `${styles.dropdownIcon} ${isOpen ? styles.rotated : ''}` }
              src={ `${imgPaths().png}down-arrow-icon.png` }
            />
          </h3>
        </button>

        { isOpen && (
          <div className={ styles.dropdown }> 
            { visualizations.map((viz, i: number) => (
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
          </div>
        ) }
      </div>
    </>
  )
}


export default TitleDropdown