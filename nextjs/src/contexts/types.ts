// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { 
  STUDY__DYNAMODB,
  BessiSkillScoresType, 
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


export type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScoresType | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScoresType | null>>
}


export type SessionContextType = {
  email: string
  username: string
  isAdmin: boolean
  isParticipant: boolean
  isAuthenticated: boolean
  userStudies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
  setEmail: Dispatch<SetStateAction<string>>
  setUsername: Dispatch<SetStateAction<string>>
  setIsAdmin: Dispatch<SetStateAction<string>>
  setIsParticipant: Dispatch<SetStateAction<boolean>>
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  setUserStudies: Dispatch<SetStateAction<STUDY_SIMPLE__DYNAMODB>>
}



export type StudiesTableContextType = {
  buttonHandlers: {
    toggleDropdown: (studyId: any) => void
    buttonHref: (studyId: string) => string
    handleDeleteStudy: (
      e: any,
      id: string,
      ownerEmail: string,
      createdAtTimestamp: number
    ) => void
  } | null
}


export type EditStudyModalContextType = {
  showEditStudyModal: string | null
  setShowEditStudyModal: Dispatch<SetStateAction<string | null>> | null
  handleOpenEditStudyModal: ((e: any, study: STUDY__DYNAMODB) => void) | null
}