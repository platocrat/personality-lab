// Externals
import { 
  FC,
  useContext
} from 'react'
// Locals
import Studies from './studies'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type AdminPortalProps = {

}




const AdminPortal: FC<AdminPortalProps> = ({

}) => {
  const { username } = useContext(AuthenticatedUserContext)

  const PAGE_TITLE = `Welcome, ${username}!`


  return (
    <>
      <div 
        style={{ 
          ...definitelyCenteredStyle,
          flexDirection: 'column',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {/* Title */}
        <h2>{ PAGE_TITLE }</h2>

        <Studies />

      </div>
    </>
  )
} 


export default AdminPortal