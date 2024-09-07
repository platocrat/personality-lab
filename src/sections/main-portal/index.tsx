'use client'

// Externals
// import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import PersonalityAssessments from '@/sections/assessments'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// // Hooks
// import useAccount from '@/hooks/useAccount'
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
  // // Auth0
  // const { user, error, isLoading } = useUser()
  // // Hooks
  // const { 
  //   isParticipant,
  //   isFetchingAccount,
  // } = useAccount()
  
  // Contexts
  const {
    email,
    isGlobalAdmin,
    // username,
    isParticipant,
  } = useContext<SessionContextType>(SessionContext)

  // const TITLE_TEXT = `Welcome, ${user?.name}!`
  const TITLE_TEXT = `Welcome, ${ email }!`
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
  }, [ ])




  return (
    <>
      <div className={ styles.mainPortal }>
        {/* <NetworkRequestSuspense
          isLoading={ isLoading || isFetchingAccount }
          spinnerOptions={{
            showSpinner: true,
            containerStyle: {
              top: '100px',
            }
          }}
        > */}
          { isParticipant ? (
            <>
              <div
                style={ {
                  position: 'relative',
                  top: '85px',
                } }
              >
                <ParticipantTitle
                  titleText={ TITLE_TEXT }
                  subtitleText={ SUBTITLE_TEXT }
                />
                <PersonalityAssessments />
              </div>
            </>
          ) : (
            <>
              <LeftHandNav>
                <Title text={ TITLE_TEXT } />
                  {/* Main content goes here */ }
                  <div style={ { ...definitelyCenteredStyle, margin: '48px' } }>
                    <p>
                      { 'Notifications and other important updates go here.' }
                    </p>
                  </div>
              </LeftHandNav>
            </>
          ) }
        {/* </NetworkRequestSuspense> */}
      </div>
    </>
  )
}


export default MainPortal