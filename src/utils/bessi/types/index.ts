import { 
  Facet, 
  Gender, 
  USState, 
  YesOrNo,
  SkillDomain, 
  SocialClass, 
  RaceOrEthnicity, 
  CurrentMaritalStatus, 
  HighestFormalEducation, 
  CurrentEmploymentStatus, 
} from './enums'


export type SkillDomainFactorType = {
  [key in SkillDomain]?: number
} 

export type FacetFactorType = { 
  [key in Facet]?: number 
}

/**
 * @dev `weight` is a number between 0 and 1.
 * 
 * `response` is a number between 1 and 5.
 */
export type UserScoresType = {
  facet: Facet
  domain: SkillDomain[]
  weight: number // between 0 and 1
  response: number // between 1 and 5
}

export type BessiSkillScores = {
  facetScores: FacetFactorType,
  domainScores: SkillDomainFactorType
}

export type BessiActivityType = {
  id: number
  activity: string
  facet: Facet
  domain: SkillDomain[]
  weight: number 
}

export type BessiUserDemographics__DynamoDB = {
  age: number
  gender: Gender
  usState: USState
  zipCode: string
  isParent: YesOrNo
  foreignCountry: string
  englishFluency: YesOrNo
  priorCompletion: YesOrNo
  socialClass: SocialClass
  raceOrEthnicity: RaceOrEthnicity
  currentMaritalStatus: CurrentMaritalStatus
  highestFormalEducation: HighestFormalEducation
  currentEmploymentStatus: CurrentEmploymentStatus
}

export type BessiUserResults__DynamoDB = {
  userId: string
  timestamp: number
  facetScores: FacetFactorType,
  domainScores: SkillDomainFactorType,
  demographics: BessiUserDemographics__DynamoDB
}