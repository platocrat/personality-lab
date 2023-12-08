// Externals
import { FC } from 'react'
// Locals
import BessiFamily from './family'
import BessiCurrentMaritalStatus from './current-marital-status'


const BessiMarriageAndFamily = () => {
  return (
    <>
      <BessiCurrentMaritalStatus />
      <BessiFamily />
    </>
  )
}

export default BessiMarriageAndFamily