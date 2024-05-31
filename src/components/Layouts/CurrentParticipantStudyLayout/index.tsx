// Externals
import { ReactNode, FC, useState } from 'react'
// Locals
import { STUDY_SIMPLE__DYNAMODB } from '@/utils'
import { CurrentParticipantStudyContext } from '@/contexts/CurrentParticipantStudyContext'


type CurrentParticipantStudyLayoutProps = {
  children: ReactNode
}




const CurrentParticipantStudyLayout: FC<CurrentParticipantStudyLayoutProps> = ({ children }) => {
  // State variables to select the participant's current study
  const [
    currentStudy,
    setCurrentStudy
  ] = useState<STUDY_SIMPLE__DYNAMODB | null>(null)


  return (
    <>
      <CurrentParticipantStudyContext.Provider
        value={ {
          currentStudy,
          setCurrentStudy,
        } }
      >
        { children }
      </CurrentParticipantStudyContext.Provider>
    </>
  )
}


export default CurrentParticipantStudyLayout