import { 
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB, 
  BessiUserResults__DynamoDB
} from '../assessments'



/**
 * ## Readable type definition:
 * @example
 * ```tsx 
 * type STUDY_SIMPLE__DYNAMODB = {
 *   id: string
 *   name: string
 *   ownerEmail: string
 *   adminEmails?: string[]
 *   assessmentId: string
 *   timestamp: number
 * }
 * ```
 */
export type STUDY_SIMPLE__DYNAMODB = Omit<
  STUDY__DYNAMODB,
  "isActive" | "details" | "participants" | "results"
> & {
  assessmentId: string
}


type STUDY_DETAILS__DYNAMODB = {
  inviteUrl: string
  description: string
  assessmentId: string
}


export type STUDY__DYNAMODB = {
  id: string
  name: string
  isActive: boolean
  ownerEmail: string
  adminEmails?: string[]
  details: STUDY_DETAILS__DYNAMODB
  participants?: PARTICIPANT__DYNAMODB[] // `undefined` for newly created study
  results?: RESULTS__DYNAMODB[] // `undefined` for newly created study
  updatedAtTimestamp: number
  createdAtTimestamp: number
}


export type HASHED_PASSWORD__DYNAMODB = {
  hash: string
  salt: string
}


/**
 * @dev An account can take an assessment without being a participant to a study
 */
export type ACCOUNT__DYNAMODB = {
  email: string
  username: string
  isAdmin: boolean
  password: HASHED_PASSWORD__DYNAMODB
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant account
  participant?: PARTICIPANT__DYNAMODB // `undefined` for a non-participant account
  updatedAtTimestamp?: number // `undefined` for a non-participant account
  createdAtTimestamp: number
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  username: string
  studies: STUDY_SIMPLE__DYNAMODB[]
  timestamp: number
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  username: string
  study: STUDY_SIMPLE__DYNAMODB
  results: any | BessiUserResults__DynamoDB
  timestamp: number
}


export type RATINGS__DYNAMODB = {
  id: string
  email: string
  username: string
  study: STUDY_SIMPLE__DYNAMODB
  rating: number
  vizName: string
  timestamp: number
}


export type CookieInputType = {
  email: string
  username: string
  password: string
  isAdmin: string
  isParticipant: string
  timestamp: string
}


export type EncryptedCookieFieldType = {
  iv: string
  encryptedData: string
}


export type CookieType = {
  email: EncryptedCookieFieldType
  username: EncryptedCookieFieldType
  password: EncryptedCookieFieldType
  isAdmin: EncryptedCookieFieldType
  isParticipant: EncryptedCookieFieldType
  timestamp: EncryptedCookieFieldType
}


export type ParticipantType = {
  email: string
  username: string
  studies: STUDY_SIMPLE__DYNAMODB[]
}