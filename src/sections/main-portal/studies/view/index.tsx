// Externals
import { FC } from 'react'
// Locals
// Sections
import ViewStudiesTitle from './title'
import ListOfStudies from './list-of-studies'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// CSS
import styles from '@/sections/main-portal/studies/view/ViewStudies.module.css'


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