import { 
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserResults__DynamoDB,
  BessiUserDemographics__DynamoDB, 
} from '../assessments'



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
 *   results?: RESULTS__DYNAMODB[]
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
  participants?: PARTICIPANT__DYNAMODB[] // `undefined` for newly created study
  results?: RESULTS__DYNAMODB[] // `undefined` for newly created study
  updatedAtTimestamp: number
}


export type HASHED_PASSWORD__DYNAMODB = {
  hash: string
  salt: string
}


export type StudyAsAdmin = {
  id: string
  name: string
  isAdmin: boolean
}


/**
 * @dev An account can take an assessment without being a participant to a study
 */
export type ACCOUNT__DYNAMODB = {
  email: string // Partition/Primary Key
  createdAtTimestamp: number // Sort Key
  hasVerifiedEmail: boolean // Auth0
  isGlobalAdmin: boolean
  studiesAsAdmin?: StudyAsAdmin[]
  results: RESULTS__DYNAMODB[] // non-study results
  password: HASHED_PASSWORD__DYNAMODB
  participant?: PARTICIPANT__DYNAMODB // `undefined` for a non-participant account
  updatedAtTimestamp?: number // `undefined` for a non-participant account
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  studies: STUDY_SIMPLE__DYNAMODB[]
  timestamp: number
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  study?: STUDY_SIMPLE__DYNAMODB
  results: any | BessiUserResults__DynamoDB
  timestamp: number
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
  isGlobalAdmin: EncryptedCookieFieldType
  isParticipant: EncryptedCookieFieldType
  timestamp: EncryptedCookieFieldType
}