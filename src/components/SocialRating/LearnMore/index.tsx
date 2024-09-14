'use client'

// Externals
import { FC, ReactNode, useState } from 'react'
// Locals
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type LearnMoreProps = {
  content: ReactNode
}



const LearnMore: FC<LearnMoreProps> = ({
  content
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleContent = (e: any) => {
    e.stopPropagation() // Prevents the parent handler from being triggered
    setIsExpanded(prev => !prev)
  }


  return (
    <>
      <div style={ { ...definitelyCenteredStyle } }>
        <button 
          style={{ width: '130px' }}
          onClick={ toggleContent }
          className={ styles.button }
        >
          <span
            style={ {
              display: 'inline-block',
              marginRight: '8px',
              transition: 'transform 0.3s',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
            } }
          >
            →
          </span>
          { isExpanded ? `Hide` : 'Learn more!' }
        </button>
      </div>

      {/* Conditionally rendered content */ }
      { isExpanded && content }
    </>
  )
}

export default LearnMore