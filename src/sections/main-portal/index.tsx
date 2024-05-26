// Externals
import Link from 'next/link'
import { FC, useContext } from 'react'
// Locals
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Contexts
import { definitelyCenteredStyle } from '@/theme/styles'


type MainPortalProps = {}



const MainPortal: FC<MainPortalProps> = ({ }) => {
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Welcome, ${username}!`



  return (
    <>
      <LeftHandNav>
        <div style={ definitelyCenteredStyle }>
          {/* Title */ }
          <h1>{ PAGE_TITLE }</h1>
        </div>

        {/* Main content goes here */ }
        <div style={{ ...definitelyCenteredStyle, margin: '48px' }}>
          { 'Notifications and other important updates go here.' }
        </div>
      </LeftHandNav>
    </>
  )
}

export default MainPortal
