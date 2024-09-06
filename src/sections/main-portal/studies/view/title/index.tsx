// Locals
// CSS
import useAccount from '@/hooks/useAccount'
import { definitelyCenteredStyle } from '@/theme/styles'

const ViewStudiesTitle = () => {
  // Contexts
  const {
    studiesAsAdmin,
    isParticipant,
  } = useAccount()
  

  const ADMIN_OR_PARTICIPANT = studiesAsAdmin && studiesAsAdmin[0].isAdmin
    ? 'an admin' 
    : isParticipant
      ? 'a participant'
      // The `/view-studies` page must be entirely hidden from the user if they
      // are not a participant nor an admin.
      : null
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