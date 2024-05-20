import { 
  FacetFactorType, 
  SkillDomainFactorType, 
  BessiUserDemographics__DynamoDB 
} from '../assessments'



export type ACCOUNT__DYNAMODB = {
  email: string
  username: string
  password: string
  isAdmin: boolean
  timestamp: number
  participant?: PARTICIPANT_DYNAMODB
}


export type RESULTS__DYNAMODB = {
  id: string
  email: string
  timestamp: number
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
  assessmentName: string
}


export type PARTICIPANT_DYNAMODB = {
  id: string
  name: any
  email: any
  adminEmail: any
  adminUsername: any
  assessmentNames: any
  isNobelLaureate: any
  timestamp: any
}


export type CookieType = {
  email: string
  username: string
  password: string
  isAdmin: string
}


export type ParticipantType = {
  name: string
  email: string
  isNobelLaureate: boolean
  assessmentNames: string[]
}