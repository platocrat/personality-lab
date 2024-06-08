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
                  alt='White checkmark to confirm that a rating was made for a visualization'
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
                  width: '36px',
                  height: '32px',
                  fontSize: '13px',
                  background: 'rgb(42, 184, 101)',
                  borderColor: 'rgb(42, 184, 101)',
                } }
              >
                <Image
                  width={ 16 }
                  height={ 16 }
                  style={ {
                    top: '1.5px',
                    position: 'relative',
                    transform: 'scaleX(-1)',
                  } }
                  alt='Thumbs up icon'
                  src={ `${imgPaths().svg}thumbs-up.svg` }
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
                  width: '36px',
                  height: '32px',
                  fontSize: '13px',
                  background: 'rgb(231, 76, 60)',
                  borderColor: 'rgb(231, 76, 60)',
                } }
              >
                <Image
                  width={ 16 }
                  height={ 16 }
                  style={{ position: 'relative', top: '1.75px' }}
                  alt='Thumbs down icon'
                  src={ `${imgPaths().svg}thumbs-down.svg` }
                />
              </button>
            </>
          ) }
      </div>
    </>
  )
}

export default RateDataViz