// Externals
import Link from 'next/link'
import { FC, Fragment, useContext } from 'react'
// Locals
import LeftHandNav from '@/components/Nav/LeftHand'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'


type StudiesProps = {}



const Studies: FC<StudiesProps> = ({ }) => {
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Welcome, ${username}!`



  return (
    <>
      <LeftHandNav>
        {/* Title */ }
        <h2>{ PAGE_TITLE }</h2>
      </LeftHandNav>
    </>
  )
}

export default Studies
