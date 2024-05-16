// Externals
import { FC } from 'react'
import Image from 'next/image'
// Locals
// Utils
import { imgPaths } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/bess-results-visualization.module.css'



type BessiShareResultsProps = {
  isCopied: boolean
  onClick: {
    handleTakeScreenshot: (e: any) => void
    handleRateVisualization: (e: any) => void
  }
}



const BUTTON_TEXT = `Rate Visualization!`


const BessiShareResults: FC<BessiShareResultsProps> = ({
  onClick,
  isCopied,
}) => {
  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          gap: '12px',
          marginBottom: '8px',
          justifyContent: 'space-between',
        } }
      >
        <div style={{ display: 'flex', gap: '4px', marginRight: '12px' }}>
          <button
            className={ appStyles.button }
            onClick={ onClick.handleRateVisualization }
            style={ {
              width: '100%',
              fontSize: '13px',
              padding: '8px 12px',
              background: 'rgb(43, 189, 104)',
              borderColor: 'rgb(43, 189, 104)',
            } }
          >
            <Image
              width={ 18 }
              height={ 18 }
              className={ sectionStyles.img }
              style={{ transform: 'scaleX(-1)' }}
              alt='Share icon to share data visualization'
              src={ `${imgPaths().svg}thumbs-up-icon.svg` }
            />
          </button>
          <button
            className={ appStyles.button }
            onClick={ onClick.handleRateVisualization }
            style={ {
              width: '100%',
              fontSize: '13px',
              padding: '8px 12px',
              background: 'rgb(231, 76, 60)',
              borderColor: 'rgb(231, 76, 60)',
            } }
          >
            <Image
              width={ 18 }
              height={ 18 }
              alt='Share icon to share data visualization'
              className={ sectionStyles.img }
              src={ `${imgPaths().svg}thumbs-down-icon.svg` }
            />
          </button>
        </div>

        <div>
          <button
            className={ appStyles.button }
            onClick={ onClick.handleTakeScreenshot }
            style={ {
              width: '50px',
              fontSize: '12.5px',
              padding: '8px 12px',
              margin: '12px 0px 12px 0px',
              backgroundColor: isCopied ? 'rgb(18, 215, 67)' : ''
            } }
          >
            <Image
              width={ 18 }
              height={ 18 }
              alt='Share icon to share data visualization'
              className={ sectionStyles.img }
              src={
                isCopied
                  ? `${imgPaths().svg}white-checkmark.svg`
                  : `${imgPaths().svg}white-share-icon.svg`
              }
            />
          </button>
        </div>
      </div>
    </>
  )
}


export default BessiShareResults