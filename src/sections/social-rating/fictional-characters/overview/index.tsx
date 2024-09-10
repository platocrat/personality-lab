// Externals
import { FC } from 'react'
// Locals
// Sections
import Content from '@/sections/social-rating/fictional-characters/overview/content'
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
        <Content />
      </div>
    </>
  )
}


export default Overview