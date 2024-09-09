// Externals
import { FC } from 'react'
// Locals
// Sections
import Instructions from './instructions'
import NoticeOnInvalidOutput from './notice-on-invalid-output'



type OverviewProps = {

}



const Overview: FC<OverviewProps> = ({
  
}) => {
  const title = (
    <>
      <div>
        { `AI-Generated` }
      </div>
      <div>
        { `Fictional Characters from Popular Culture` }
      </div>
    </>
  )

  return (
    <>
      <h2>
        { title }
      </h2>

      <div>
        <Instructions />
        <NoticeOnInvalidOutput />
      </div>
    </>
  )
}


export default Overview