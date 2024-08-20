// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { generateButtonStyle } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import mainPortalStyle from '@/sections/main-portal/MainPortal.module.css'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



export type SocialRatingProps = {
  state: {
    completed: boolean
    totalPrompts: number
    totalCharacters: number
    setCompleted: Dispatch<SetStateAction<boolean>>
  }
}



const SocialRatingNotification = ({ state }) => {
  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          position: 'absolute',
          zIndex: '1000',
          top: '0px',
          right: '8px',
        } }
      >
        { state.completed && (
          <>
            <div
              style={ {
                display: 'flex',
                flexDirection: 'row',
                padding: '12px 18px'
              } }
              className={
                `${styles['notification-card']} ${state.completed ? '' : styles['hide']}`
              }
            >
              { `Generated ${state.totalCharacters} characters from ${state.totalPrompts} prompts.` }
              <button
                style={ generateButtonStyle }
                onClick={ () => state.setCompleted(false) }
                className={ mainPortalStyle['close-button'] }
              >
                &times;
              </button>
            </div>
          </>
        ) }
      </div>
    </>
  )
}



export default SocialRatingNotification