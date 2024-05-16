// Externals
import { FC } from 'react'
import Image from 'next/image'
// Locals
// Utils
import { imgPaths } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization/bessi-results-visualization.module.css'



type BessiShareResultsProps = {
  state: {
    isCopied: boolean
    isRating: boolean
  }
  onClick: {
    handleTakeScreenshot: (e: any) => void
    handleRateVisualization: (
      e: any, 
      positiveOrNegative: 'positive' | 'negative'
    ) => void
  }
}




const BessiShareResults: FC<BessiShareResultsProps> = ({
  state,
  onClick,
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
          { state.isRating
            ? (
              <>
                <div className={ sectionStyles.completedRating }>
                  <Image
                    width={ 24 }
                    height={ 24 }
                    style={{ 
                      ...definitelyCenteredStyle,
                      position: 'relative',
                      top: '3px',
                    }}
                    alt='Share icon to share data visualization'
                    src={ `${imgPaths().svg}white-checkmark.svg` }
                  />
                </div>
              </>
            ) : (
              <>
                <button
                  className={ appStyles.button }
                  onClick={ 
                    (e: any) => onClick.handleRateVisualization(
                      e, 
                      'positive'
                    )
                  }
                  style={ {
                    width: '100%',
                    fontSize: '13px',
                    padding: '8px 12px',
                    background: 'rgb(42, 184, 101)',
                    borderColor: 'rgb(42, 184, 101)',
                  } }
                  >
                  <Image
                    width={ 18 }
                    height={ 18 }
                    style={ { transform: 'scaleX(-1)' } }
                    alt='Share icon to share data visualization'
                    src={ `${imgPaths().svg}thumbs-up-icon.svg` }
                    />
                </button>
                <button
                  className={ appStyles.button }
                  onClick={ 
                    (e: any) => onClick.handleRateVisualization(
                      e,
                      'negative'
                    )
                  }
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
                    src={ `${imgPaths().svg}thumbs-down-icon.svg` }
                  />
                </button>
              </>
            ) }
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
              backgroundColor: state.isCopied ? 'rgb(18, 215, 67)' : ''
            } }
          >
            <Image
              width={ 18 }
              height={ 18 }
              alt='Share icon to share data visualization'
              className={ sectionStyles.img }
              src={
                state.isCopied
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