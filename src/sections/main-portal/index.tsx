// Externals
import { FC, useContext } from 'react'
// Locals
import PersonalityAssessments from '../assessments'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Contexts
import { definitelyCenteredStyle } from '@/theme/styles'


type MainPortalProps = {}



const Title = ({ text }) => {
  return (
    <>
      <div>
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
  return (
    <>
      <div 
        style={{
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        }}
      >
        <Title text={ titleText } /> 
        <Subtitle text={ subtitleText } />
      </div>
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



  return (
    <>
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
              { 'Notifications and other important updates go here.' }
            </div>
          </LeftHandNav>
        </>
      )}
    </>
  )
}

export default MainPortal
