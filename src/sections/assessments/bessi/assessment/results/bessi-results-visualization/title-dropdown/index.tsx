// Externals
import Image from 'next/image'
import { Fragment, useRef, useState } from 'react'
// Locals
// Hooks
import useClickOutside from '@/app/hooks/useClickOutside'
// Utils
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
  // Refs
  const menuRef = useRef(null)
  // States
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


  // -------------------------------- Hooks ------------------------------------
  useClickOutside(menuRef, () => setIsOpen(false))




  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          position: 'relative',
          textAlign: 'center',
          marginBottom: '18px',
        } }
      >
        <button
          onClick={ toggleDropdown }
          className={ styles.dropdownButton }
        >
          <h3 
            style={{ fontSize: '18px' }}
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
          <div ref={ menuRef } className={ styles.dropdown }> 
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