'use client'

// Externals
import { useContext } from 'react'
// Locals
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const ViewStudiesTitle = () => {
  // Contexts
  const { username } = useContext<SessionContextType>(SessionContext)

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