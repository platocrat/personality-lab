'use client'

// Externals
import { FC, ReactNode, useState } from 'react'
// Locals
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/SocialRating.module.css'



type LearnMoreProps = {
  content: ReactNode
}



const LearnMore: FC<LearnMoreProps> = ({
  content
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleContent = () => {
    setIsExpanded(prev => !prev)
  }


  return (
    <>
      <div style={ { ...definitelyCenteredStyle } }>
        <button 
          style={{ width: '130px' }}
          onClick={ toggleContent }
          className={ appStyles.button }
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