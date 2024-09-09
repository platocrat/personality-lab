// Externals
import { FC } from 'react'
// Locals
// Sections
import Instructions from './instructions'



type OverviewProps = {

}



const Overview: FC<OverviewProps> = ({

}) => {
  const title = (
    <>
      <div>
        { `The BESSI Social Rating Game` }
      </div>
      <div>
        {/* { `Fictional Characters from Popular Culture` } */}
      </div>
    </>
  )

  return (
    <>
      {/* Title */ }
      <h2>
        { title }
      </h2>

      <div>
        <Instructions />
      </div>
    </>
  )
}


export default Overview