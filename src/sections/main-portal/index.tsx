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



const PageTitle = ({ pageTitle }) => {
  return (
    <>
      <div style={ definitelyCenteredStyle }>
        {/* Title */ }
        <h1>{ pageTitle }</h1>
      </div>
    </>
  )
}



const MainPortal: FC<MainPortalProps> = ({ }) => {
  const { 
    isAdmin,
    username,
    isParticipant, 
  } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Welcome, ${username}!`



  return (
    <>
      { isParticipant ? (
        <>
          <div style={{ position: 'relative', top: '85px' }}>
            <PageTitle pageTitle={ PAGE_TITLE }/>
            <PersonalityAssessments />
          </div>
        </>
      ) : (
        <>
          <LeftHandNav>
            <PageTitle pageTitle={ PAGE_TITLE } />
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
