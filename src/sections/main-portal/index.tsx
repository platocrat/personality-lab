// Externals
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import PersonalityAssessments from '../assessments'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Utils
import { getUsernameAndEmailFromCookie } from '@/utils'
// Styles
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/main-portal/MainPortal.module.css'


type MainPortalProps = {}



const Title = ({ text }) => {
  return (
    <>
      <div 
        style={ definitelyCenteredStyle }
        className={ styles.welcomeTitle }
      >
        <h1>{ text }</h1>
      </div>
    </>
  )
}

const Subtitle = ({ text }) => {
  return (
    <>
      <div 
        style={{ 
          width: '60%', 
          maxWidth: '600px',
          margin: '12px 0px 12px 0px'
        }}
      >
        <h4>
          { text }
        </h4>
      </div>
    </>
  )
}

const ParticipantTitle = ({
  titleText,
  subtitleText
}) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null


  return (
    <>
      { isVisible && (
        <div style={ { ...definitelyCenteredStyle, padding: '0px 24px' } }>
          <div className={ styles['notification-card'] }>
            <button 
              onClick={ handleClose }
              className={ styles['close-button'] } 
            >
              &times;
            </button>
            <Title text={ titleText } />
            <Subtitle text={ subtitleText } />
          </div>
        </div>
      )}
    </>
  )
}




const MainPortal: FC<MainPortalProps> = ({ }) => {
  // Contexts
  const { 
    isAdmin,
    username,
    isParticipant, 
  } = useContext(AuthenticatedUserContext)

  const TITLE_TEXT = `Welcome, ${username}!`
  const SUBTITLE_TEXT = `Based on the studies you have registered for, listed below are the assessments that you may take.`


  function resetCurrentStudy(): void {
    const key = 'currentStudy'
    localStorage.removeItem(key)
  }


  /**
   * @dev Used for debugging cookies
   */
  async function _getUsernameAndEmailFromCookie() {
    const cookieValues = await getUsernameAndEmailFromCookie()

    console.log(
      `[${new Date().toLocaleString()} \ --filepath="src/sections/assessments/bessi/assessment/index.tsx"]:`,
      `client-side decrypted email and username jwt-cookie ensure. Double-check that these values aren't being intercepted by hackers to change any of its values.`,
      cookieValues
    )
  }


  
  useLayoutEffect(() => {
    resetCurrentStudy()

    const requests = [
      _getUsernameAndEmailFromCookie,
    ]

    Promise.all(requests)
  }, [])




  return (
    <>
      <div className={ styles.mainPortal }>
        { isParticipant ? (
          <>
            <div 
              style={{
                position: 'relative',
                top: '85px',
              }}
            >
              <ParticipantTitle 
                titleText={ TITLE_TEXT } 
                subtitleText={ SUBTITLE_TEXT} 
              />
              <PersonalityAssessments />
            </div>
          </>
        ) : (
          <>
            <LeftHandNav>
              <Title text={ TITLE_TEXT } />
              {/* Main content goes here */ }
              <div style={{ ...definitelyCenteredStyle, margin: '48px' }}>
                <p>
                  { 'Notifications and other important updates go here.' }
                </p>
              </div>
            </LeftHandNav>
          </>
        )}
      </div>
    </>
  )
}

export default MainPortal
