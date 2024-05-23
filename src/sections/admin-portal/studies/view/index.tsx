// Externals
import { FC} from 'react'
// Locals
// Sections
import ViewStudy from './study'
import ViewStudiesTitle from './title'
import ListOfStudies from './list-of-studies'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/admin-portal/studies/view/ViewStudies.module.css'



type ViewStudiesProps = {

}

  


const ViewStudies: FC<ViewStudiesProps> = ({

}) => {


  return (
    <>
      <LeftHandNav>
        <div className={ `${ styles['form-container'] }` }>
          <ViewStudiesTitle />
          <ListOfStudies />
        </div>
      </LeftHandNav>
    </>
  )
}


export default ViewStudies