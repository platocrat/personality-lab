import { 
  GamePhases,
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserResults__DynamoDB,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
import { GameSessionContextType } from '@/contexts/types'




/**
 * ## Readable type definition:
 * @example
 * ```tsx 
 * type STUDY_SIMPLE__DYNAMODB = {
 *   id: string
 *   name: string
 *   ownerEmail: string
 *   assessmentId: string
 *   adminEmails?: string[]
 *   timestamp: number
 * }
 * ```
 */
export type STUDY_SIMPLE__DYNAMODB = Omit<
  STUDY__DYNAMODB,
  "isActive" | "details" | "participants"
> & {
  assessmentId: string
}


type STUDY_DETAILS__DYNAMODB = {
  inviteUrl: string
  description: string
  assessmentId: string
}


export type STUDY__DYNAMODB = {
  ownerEmail: string // Partition/Primary Key
  createdAtTimestamp: number // Sort Key
  id: string
  name: string
  isActive: boolean
  adminEmails?: string[]
  details: STUDY_DETAILS__DYNAMODB
  participants?: PARTICIPANT__DYNAMODB[] // undefined for newly created study
  updatedAtTimestamp: number
}


export type HASHED_PASSWORD__DYNAMODB = {
  hash: string
  salt: string
}


/**
 * @dev Type definition for a study of an admin of said study.
 */
export type StudyAsAdmin = {
  id: string
  name: string
  isAdmin: boolean
}


export type ACCOUNT__DYNAMODB = {
  email: string // Partition/Primary Key
  createdAtTimestamp: number // Sort Key
  hasVerifiedEmail: boolean // Auth0
  isGlobalAdmin: boolean
  password: HASHED_PASSWORD__DYNAMODB
  studiesAsAdmin: StudyAsAdmin[] | []
  participant?: PARTICIPANT__DYNAMODB // undefined for a non-participant account
  lastLoginTimestamp: number
  lastLogoutTimestamp: number
  updatedAtTimestamp?: number // undefined for a non-participant account
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  studies: STUDY_SIMPLE__DYNAMODB[]
  timestamp: number
}


export type RESULTS__DYNAMODB = {
  id: string // Partition/Primary Key
  assessmentId: string // ID of the assessment taken
  results: BessiUserResults__DynamoDB | any // The results data, can be any type
  timestamp: number // Creation timestamp
  isSocialRatingGame?: boolean // If it's part of a social rating game
  email?: string // GSI 1: account email (can also act as an owner reference)
  studyId?: string // GSI 2: Study ID, if linked to a study
}


export type USER_RESULTS_ACCESS_TOKENS__DYNAMODB = {
  accessToken: string // Partition/Primary Key
  id: string // Sort Key -- A.K.A. user results ID
  studyId?: string // undefined for non-study results
  assessmentId: string
}


export type RATINGS__DYNAMODB = {
  id: string // Partition/Primary Key
  timestamp: number // Sort Key
  email: string
  study?: STUDY_SIMPLE__DYNAMODB // undefined for a non-study
  rating: number
  vizName: string
}


/**
 * @dev Profile correlations are done between each player's self-rating and each
 *      of their observer-ratings, round robin style for each player. For 
 *      example, assuming 3 players in a game, player 1 has their profile 
 *      correlations calculated using their self-rating and each of their 2
 *      observer-ratings. This results in a total of 2 profile correlations for 
 *      each player in a game of 3 players. The average of the 2 profile 
 *      correlations is taken and then used to rank each player against each 
 *      other.
 */
export type ProfileCorrelations = {
  [ nickname: string ]: number
} | { }


export type PlayerInGameState = {
  hasCompletedConsentForm: boolean
  hasCompletedSelfReport: boolean
  hasCompletedObserverReport: boolean
  profileCorrelations: ProfileCorrelations
}


export type Player = {
  hasJoined: boolean
  ipAddress: string
  inGameState: PlayerInGameState
  joinedAtTimestamp: number
}

export type SocialRatingGamePlayers = {
  [nickname: string]: Player
}


export type SOCIAL_RATING_GAME__DYNAMODB = {
  sessionId: string // Partition/Primary Key
  createdAtTimestamp: number // Sort Key
  hostEmail: string // Global Secondary Index
  gameId: string
  phase: GamePhases
  isActive: boolean
  sessionPin: string
  sessionQrCode: string
  isGameInSession: boolean
  gameSessionUrlSlug: string
  players: SocialRatingGamePlayers
  updatedAtTimestamp: number
}


export type SHORT_URL__DYNAMODB = {
  shortId: string // Partition/Primary Key
  originalUrl: string
}


export type CookieInputType = {
  email: string
  username: string
  password: string
  isGlobalAdmin: string
  isParticipant: string
  timestamp: string
}


export type EncryptedCookieFieldType = {
  iv: string
  encryptedData: string
}


export type CookieType = {
  email: EncryptedCookieFieldType
  // username: EncryptedCookieFieldType
  password: EncryptedCookieFieldType
  studiesAsAdmin: EncryptedCookieFieldType,
  isGlobalAdmin: EncryptedCookieFieldType
  isParticipant: EncryptedCookieFieldType
  timestamp: EncryptedCookieFieldType
}