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
  }
  participants: PARTICIPANT__DYNAMODB[]
}


export type ACCOUNT__DYNAMODB = {
  email: string
  username: string
  timestamp: number
  isAdmin: boolean
  password: { 
    hash: string
    salt: string
  }
  studies: {
    name: string
    assessmentId: string
  }[]
  participant?: PARTICIPANT__DYNAMODB
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  timestamp: number
  study: {
    name: string
    assessmentId: string
  }
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
  // results: any | {
  //   facetScores: FacetFactorType
  //   domainScores: SkillDomainFactorType
  //   demographics: BessiUserDemographics__DynamoDB
  // }
}


export type PARTICIPANT__DYNAMODB = {
  id: string
  email: string
  username: string
  adminEmail: string
  adminUsername: string
  isNobelLaureate: boolean
  timestamp: number
  studies: {
    name: string
    assessmentId: string
  }[]
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
  studies: {
    name: string
    assessmentId: string
  }[]
}