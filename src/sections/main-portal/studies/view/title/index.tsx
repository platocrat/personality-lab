'use client'

// Externals
import { useContext } from 'react'
// Locals
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const ViewStudiesTitle = () => {
  // Contexts
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Studies where you are an admin.`



  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column'
        } }
      >
        {/* Title */ }
        <h3>
          { PAGE_TITLE }
        </h3>
      </div>
    </>
  )
}


export default ViewStudiesTitle