// Locals
import { FC } from 'react'
// Locals
import BessiCurrentEmploymentStatus from './current-employment-status'
import BessiHighestFormalEducation from './highest-formal-education'


const BessiEducationAndWork = () => {
  return (
    <>
      <BessiHighestFormalEducation />
      <BessiCurrentEmploymentStatus />
    </>
  )
}

export default BessiEducationAndWork