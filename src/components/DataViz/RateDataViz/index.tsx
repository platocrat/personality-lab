// Externals
import { FC } from 'react'
import Image from 'next/image'
// Locals
// Utils
import { imgPaths } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import componentStyles from '@/components/DataViz/RateDataViz/RateDataViz.module.css'


type RateDataVizProps = {
  isRating: boolean
  handleRateVisualization: (e: any, rating: 'positive' | 'negative') => void
}



const RateDataViz: FC<RateDataVizProps> = ({
  isRating,
  handleRateVisualization,
}) => {
  return (
    <>
      <div style={ { display: 'flex', gap: '4px', marginRight: '12px' } }>
        { isRating
          ? (
            <>
              <div className={ componentStyles.completedRating }>
                <Image
                  width={ 24 }
                  height={ 24 }
                  style={ {
                    ...definitelyCenteredStyle,
                    position: 'relative',
                    top: '3px',
                  } }
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
                  (e: any) => handleRateVisualization(
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
                  style={ {
                    top: '-1.5px',
                    position: 'relative',
                    transform: 'scaleX(-1)',
                  } }
                  alt='Share icon to share data visualization'
                  src={ `${imgPaths().svg}thumbs-up-icon.svg` }
                />
              </button>
              <button
                className={ appStyles.button }
                onClick={
                  (e: any) => handleRateVisualization(
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
    </>
  )
}

export default RateDataViz