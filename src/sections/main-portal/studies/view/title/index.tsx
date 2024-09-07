// Externals
import { useMemo } from 'react'
// Locals
import useAccount from '@/hooks/useAccount'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const ViewStudiesTitle = () => {
  // Contexts
  const {
    isGlobalAdmin,
    isParticipant,
    studiesAsAdmin,
  } = useAccount()
  

  const ADMIN_OR_PARTICIPANT = useMemo((): string | undefined => {
    let _: string | undefined = undefined

    if (isGlobalAdmin) {
      _ = 'an admin'
    } else {
      if (studiesAsAdmin) {
        // Since this page is only viewable if the user is an admin for a study,
        // the user is shown their list of studies which they are an admin of.
        // Since we only need to check the first item in the array of studies, we
        // simply check that the first item's `isAdmin` value is `true`. 
        if (studiesAsAdmin[0].isAdmin === true) {
          _ = 'an admin'
        } else {
          if (isParticipant) {
            _ = 'a participant'
          }
        }
      }
    }

    return _
  }, [ studiesAsAdmin, isParticipant, isGlobalAdmin ])

  const PAGE_TITLE = `Studies where you are ${ ADMIN_OR_PARTICIPANT }.`



  return (
    <>
      <div
        style={{
          ...definitelyCenteredStyle,
          flexDirection: 'column'
        }}
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