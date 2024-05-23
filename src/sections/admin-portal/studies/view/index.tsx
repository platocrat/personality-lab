// Externals
import { FC} from 'react'
import ViewStudiesTitle from './title'
import { definitelyCenteredStyle } from '@/theme/styles'
import ViewStudy from './study'
import ListOfStudies from './list-of-studies'
import LeftHandNav from '@/components/Nav/LeftHand'



type ViewStudiesProps = {

}

  


const ViewStudies: FC<ViewStudiesProps> = ({

}) => {


  return (
    <>
      <LeftHandNav>
        <ViewStudiesTitle />
        <ListOfStudies />
      </LeftHandNav>
    </>
  )
}


export default ViewStudies