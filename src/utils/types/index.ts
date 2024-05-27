import { 
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB, 
  BessiUserResults__DynamoDB
} from '../assessments'



export type StudySimple__DynamoDB = {
  name: string
  assessmentId: string
}


type StudyDetails__DynamoDB = {
  inviteUrl: string
  description: string
  assessmentId: string
}


export type STUDY__DYNAMODB = {
  id: string
  name: string
  isActive: boolean
  timestamp: number
  ownerEmail: string
  adminEmails: string[]
  details: StudyDetails__DynamoDB
  participants: PARTICIPANT__DYNAMODB[]
}


type HashedPassword = {
  hash: string
  salt: string
}


export type ACCOUNT__DYNAMODB = {
  email: string
  username: string
  timestamp: number
  isAdmin: boolean
  password: HashedPassword
  studies: StudySimple__DynamoDB[]
  participant?: PARTICIPANT__DYNAMODB
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  username: string
  adminEmail: string
  adminUsername: string
  isNobelLaureate: boolean
  timestamp: number
  studies: StudySimple__DynamoDB[]
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  username: string
  timestamp: number
  study: StudySimple__DynamoDB
  results: any | BessiUserResults__DynamoDB
}


export type RATINGS__DYNAMODB = {
  id: string
  email: string
  username: string
  study: StudySimple__DynamoDB
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
  isNobelLaureate: boolean
  studies: StudySimple__DynamoDB[]
}