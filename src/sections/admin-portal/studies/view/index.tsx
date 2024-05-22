// Externals
import { FC} from 'react'
import ViewStudiesTitle from './title'
import { definitelyCenteredStyle } from '@/theme/styles'
import ViewStudy from './study'
import ListOfStudies from './list-of-studies'



type ViewStudiesProps = {

}

  


const ViewStudies: FC<ViewStudiesProps> = ({

}) => {


  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column'
        } }
      >
        <ViewStudiesTitle />
        <ListOfStudies />
      </div>
    </>
  )
}


export default ViewStudies