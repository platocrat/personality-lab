'use client'

// Externals
import { FC, useContext } from 'react'
// Locals
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const ViewStudiesTitle = () => {
  // Contexts
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `You are viewing your list of studies.`



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