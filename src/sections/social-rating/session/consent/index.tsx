// Externals
import { FC } from 'react'
// Locals
import Bessi from '@/sections/assessments/bessi'



type ConsentProps = {
  onCompletion: () => Promise<void>
}



const Consent: FC<ConsentProps> = ({
  onCompletion
}) => {

  return (
    <>
      <Bessi onCompletion={ onCompletion } />
    </>
  )
}


export default Consent