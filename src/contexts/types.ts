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