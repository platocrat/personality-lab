import React, { FC, useState, useEffect, useRef } from 'react'
// Locals
import { TopChangesType } from '..'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/sections/profile/historical-assessments/HistoricalAssessments.module.css'

type ImportantWeeklyUpdatesProps = {
  formatKey: (key: any) => any
  topChanges: TopChangesType[]
}

const ImportantWeeklyUpdates: FC<ImportantWeeklyUpdatesProps> = ({
  topChanges,
  formatKey,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        setCardWidth(carouselRef.current.offsetWidth)
      }
    }

    // Set initial card width
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    resetAutoFlip()
  }

  const resetAutoFlip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex < topChanges.length - 1 ? prevIndex + 1 : 0))
    }, 5000)
  }

  useEffect(() => {
    resetAutoFlip()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [topChanges.length])





  return (
    <>
      <div className={ styles.carouselContainer } ref={ carouselRef }>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '12px' }}>
            { `Highlights since last week` }
          </h3>
        </div>
        {/* Dots */}
        <div className={ styles.dotsContainer }>
          { topChanges.map((_, index) => (
            <span
              key={ index }
              className={ `${styles.dot} ${currentIndex === index ? styles.activeDot : ''}` }
              onClick={ () => handleDotClick(index) }
            />
          )) }
        </div>
        {/* Carousel */}
        <div className={ styles.carouselWrapper }>
          <div className={ styles.carouselContentWrapper }>
            <div
              className={ styles.carouselContent }
              style={ { transform: `translateX(-${currentIndex * cardWidth}px)` } }
            >
              { topChanges.map((change: TopChangesType) => (
                <div key={ change.key } className={ styles.card }>
                  {/* Title */ }
                  <div className={ styles.titleContainer }>
                    <h4
                      style={{
                        fontSize: 'clamp(14px, 2vw, 16px)'
                      }}
                    >
                      { `${formatKey(change.key)}` }
                    </h4>
                  </div>

                  {/* Change since last week */ }
                  <div className={ styles.changeSection }>
                    <p 
                      className={ `${styles.percentChange} ${change.change < 0 ? styles.negative : ''}` }
                      style={{
                        fontSize: 'clamp(12px, 2vw, 16px)'
                      }}
                    >
                      { `${change.change > 0 ? '+' : ''} ${change.change.toFixed(2)}%` }
                    </p>
                    <p 
                      className={ styles.magnitudeChange }
                      style={{
                        fontSize: 'clamp(8px, 2vw, 13px)'
                      }}
                    >
                        { `since last week` }
                    </p>
                  </div>

                  {/* Progress Bar */ }
                  <div className={ styles.progressBarContainer }>
                    <div
                      className={ styles.progressBar }
                      style={ {
                        width: `${Math.min(100, Math.abs(change.change))}%`,
                        backgroundColor: change.change > 0 ? 'green' : 'red'
                      } }
                    />
                  </div>
                </div>
              )) }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportantWeeklyUpdates
