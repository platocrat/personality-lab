// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { 
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