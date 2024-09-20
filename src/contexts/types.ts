// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import {
  GamePhases,
  StudyAsAdmin,
  STUDY__DYNAMODB,
  BessiSkillScoresType,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB,
  SocialRatingGamePlayers,
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
  }
}



export type EditStudyModalContextType = {
  showEditStudyModal: string
  setShowEditStudyModal: Dispatch<SetStateAction<string>>
  handleOpenEditStudyModal: ((e: any, study: STUDY__DYNAMODB) => void)
}



export type GameSessionContextType = {
  gameId: string // Set when the game host selects a game
  isHost: boolean
  phase: GamePhases
  hostEmail: string
  sessionId: string
  sessionPin: string
  sessionQrCode: string
  isGameSession: boolean
  isGameInSession: boolean
  gameSessionUrlSlug: string
  players: SocialRatingGamePlayers
  // Setters
  setGameId: Dispatch<SetStateAction<string>> // Set when the game host selects a game
  setIsHost: Dispatch<SetStateAction<boolean>>
  setHostEmail: Dispatch<SetStateAction<string>>
  setSessionId: Dispatch<SetStateAction<string>>
  setPhase: Dispatch<SetStateAction<GamePhases>>
  setSessionPin: Dispatch<SetStateAction<string>>
  setSessionQrCode: Dispatch<SetStateAction<string>>
  setIsGameSession: Dispatch<SetStateAction<boolean>>
  setIsGameInSession: Dispatch<SetStateAction<boolean>>
  setGameSessionUrlSlug: Dispatch<SetStateAction<string>>
  setPlayers: Dispatch<SetStateAction<SocialRatingGamePlayers>>
}



export type SessionContextType = {
  email: string
  // username: string
  accountError: string
  isGlobalAdmin: boolean
  isParticipant: boolean
  isAuthenticated: boolean
  isFetchingSession: boolean
  studiesAsAdmin?: StudyAsAdmin[]
  userStudies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
  participant?: PARTICIPANT__DYNAMODB | undefined
  setEmail: Dispatch<SetStateAction<string>>
  // setUsername: Dispatch<SetStateAction<string>>
  setIsGlobalAdmin: Dispatch<SetStateAction<boolean>>
  setIsParticipant: Dispatch<SetStateAction<boolean>>
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  setUserStudies: Dispatch<SetStateAction<STUDY_SIMPLE__DYNAMODB[] | undefined>>
}