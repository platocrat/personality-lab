// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { 
  StudyAsAdmin,
  STUDY__DYNAMODB,
  BessiSkillScoresType, 
  STUDY_SIMPLE__DYNAMODB,
  PARTICIPANT__DYNAMODB,
} from '@/utils'




export type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScoresType | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScoresType | null>>
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


export type GameSessionContextType = {
  sessionId: string | null
  sessionPin: string | null
  sessionQrCode: string | null
  setSessionId: ((id: string) => void) | null
  setSessionPin: ((pin: string) => void) | null
  setSessionQrCode: ((qrCode: string) => void) | null
}


export type SessionContextType = {
  email: string
  // username: string
  accountError: string
  isGlobalAdmin: boolean
  isParticipant: boolean
  isAuthenticated: boolean
  studiesAsAdmin?: StudyAsAdmin[]
  userStudies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
  participant?: PARTICIPANT__DYNAMODB | undefined
  setEmail: Dispatch<SetStateAction<string>>
  // setUsername: Dispatch<SetStateAction<string>>
  setIsGlobalAdmin: Dispatch<SetStateAction<string>>
  setIsParticipant: Dispatch<SetStateAction<boolean>>
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  setUserStudies: Dispatch<SetStateAction<STUDY_SIMPLE__DYNAMODB>>
}
