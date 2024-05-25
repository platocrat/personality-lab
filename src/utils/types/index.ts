import { 
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB 
} from '../assessments'




export type STUDY__DYNAMODB = {
  id: string
  name: string
  isActive: boolean
  timestamp: number
  ownerEmail: string
  adminEmails: string[]
  details: {
    inviteUrl: string
    description: string
    assessmentId: string
    allowedSubmissionsPerParticipant: number
  }
  participants: PARTICIPANT__DYNAMODB[]
}


export type ACCOUNT__DYNAMODB = {
  email: string
  username: string
  timestamp: number
  isAdmin: boolean
  studyNames: string[]
  password: { 
    hash: string
    salt: string
  }
  participant?: PARTICIPANT__DYNAMODB
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  timestamp: number
  studyName: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  username: string
  adminEmail: string
  studyNames: string[]
  adminUsername: string
  isNobelLaureate: boolean
  timestamp: number
}


type EncryptedCookieFieldType = {
  iv: string
  encryptedData: string
}


export type CookieType = {
  email: EncryptedCookieFieldType
  username: EncryptedCookieFieldType
  password: EncryptedCookieFieldType
  isAdmin: EncryptedCookieFieldType
}


export type ParticipantType = {
  email: string
  username: string
  isNobelLaureate: boolean
  studyNames: string[]
}