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
          justifyContent: 'space-between',
        } }
      >
        
        <RateDataViz 
          isRating={ state.isRating }
          handleRateVisualization={ onClick.handleRateVisualization }
        />

        <div>
          <button
            className={ styles.button }
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
              src={
                state.isCopied
                  ? `${imgPaths().svg}white-checkmark.svg`
                  : `${imgPaths().svg}white-share.svg`
              }
            />
          </button>
        </div>
      </div>
    </>
  )
}


export default ShareResults