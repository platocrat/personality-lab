// Externals
import Link from 'next/link'
import { FC, Fragment, useContext } from 'react'
// Locals
import LeftHandNav from '@/components/Nav/LeftHand'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
import { definitelyCenteredStyle } from '@/theme/styles'


type StudiesProps = {}



const Studies: FC<StudiesProps> = ({ }) => {
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Welcome, ${username}!`



  return (
    <>
      <LeftHandNav>
        <div style={ definitelyCenteredStyle }>
          {/* Title */ }
          <h2>{ PAGE_TITLE }</h2>
        </div>
        
        {/* Main content goes here */}
        
      </LeftHandNav>
    </>
  )
}

export default Studies
