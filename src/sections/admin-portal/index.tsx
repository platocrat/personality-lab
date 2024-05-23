// Externals
import { 
  FC
} from 'react'
// Locals
import Studies from './studies'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type AdminPortalProps = {

}




const AdminPortal: FC<AdminPortalProps> = ({

}) => {
  return (
    <>
      <div>
        <Studies />
      </div>
    </>
  )
} 


export default AdminPortal