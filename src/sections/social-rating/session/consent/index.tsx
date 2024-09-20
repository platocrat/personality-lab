// Externals
import { FC, useContext } from 'react'
// Locals
import Bessi from '@/sections/assessments/bessi'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { GamePhases } from '@/utils'



type ConsentProps = {
  onCompletion: (e: any) => void
}



const Consent: FC<ConsentProps> = ({
  onCompletion,
}) => {
  return (
    <>
      <Bessi onCompletion={ onCompletion } />
    </>
  )
}


export default Consent