'use client'

// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import PersonalityAssessments from '@/sections/assessments'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// Utils
import { ACCOUNT__DYNAMODB } from '@/utils'
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
  // Auth0
  const { user, error, isLoading, checkSession } = useUser()
  // State
  const [ isParticipant, setIsParticipant ] = useState(false)
  const [ isGettingParticipant, setIsGettingParticipant ] = useState(false)

  const TITLE_TEXT = `Welcome, ${user?.name}!`
  const SUBTITLE_TEXT = `Based on the studies you have registered for, listed below are the assessments that you may take.`


  function resetCurrentStudy(): void {
    const key = 'currentStudy'
    localStorage.removeItem(key)
  }

  /**
   * @dev Request account entry from `accounts` table which has a `participant`
   *      property.
   */
  async function getIsParticipant() {
    setIsGettingParticipant(true)

    try {
      const apiEndpoint = `/api/account`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()

      if (response.status === 404) throw new Error(json.error)
      if (response.status === 400) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      if (response.status === 200) {
        const account: ACCOUNT__DYNAMODB = json.account

        console.log(
          `[${ new Date().toLocaleString()}: --filepath="src/sections/main-portal/index.tsx" --function="getIsParticipant()"]: `, 
          account
        )

        const participant_ = account.participant ? true : false

        setIsParticipant(participant_)
        setIsGettingParticipant(false)
      }
    } catch (error: any) {
      setIsGettingParticipant(false)
      throw new Error(error)
    }
  }


  useLayoutEffect(() => {
    resetCurrentStudy()

    if (!isLoading && user && user.email) {
      const requests = [
        getIsParticipant()
      ]

      Promise.all(requests)
    } else if (!isLoading && !user) {
      console.error(
        `Auth0 couldn't get 'user' from useUser(): `, 
        error
      )
    }
  }, [ isLoading ])




  return (
    <>
      <div className={ styles.mainPortal }>
        { isLoading || isGettingParticipant ? (
          <>
            <div
              style={{
                ...definitelyCenteredStyle,
                position: 'relative',
                top: '80px',
              }}
            >
              <Spinner height='40' width='40' />
            </div>
          </>
        ) : (
          <>
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
            )}
          </>
        )}
      </div>
    </>
  )
}


export default MainPortal