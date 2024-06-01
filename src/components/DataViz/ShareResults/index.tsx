// Externals
import { FC } from 'react'
import Image from 'next/image'
// Locals
import RateDataViz from '../RateDataViz'
// Utils
import { imgPaths } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import BessiShareResultsButton from '@/components/Buttons/BESSI/ShareResultsButton'



type ShareResultsProps = {
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




const ShareResults: FC<ShareResultsProps> = ({
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
        } }
      >
        
        <RateDataViz 
          isRating={ state.isRating }
          handleRateVisualization={ onClick.handleRateVisualization }
        />

        <div>
          { state.isCopied ? (
            <>
              <div 
                style={{
                  ...definitelyCenteredStyle,
                  borderRadius: `1rem`,
                  borderWidth: `1.2px`,
                  width: '40px',
                  height: '32px',
                  margin: '12px 0px',
                  backgroundColor: 'rgb(18, 215, 67)'
                }}
              >
                <Image
                  width={ 18 }
                  height={ 18 }
                  alt='Share icon to share data visualization'
                  src={ `${imgPaths().svg}white-checkmark.svg` }
                />
              </div>
            </>
          ) : (
            <>
              <button
                className={ styles.button }
                onClick={ onClick.handleTakeScreenshot }
                style={ {
                  width: '40px',
                  height: '32px',
                  fontSize: '12.5px',
                  padding: '7px 8px',
                  margin: '12px 0px 12px 0px',
                } }
              >
                <Image
                  width={ 17 }
                  height={ 17 }
                  alt='Share icon to share data visualization'
                  src={ `${imgPaths().svg}download-image.svg` }
                />
              </button>
            </>
          ) }
        </div>
        
        <BessiShareResultsButton />
      </div>
    </>
  )
}


export default ShareResults