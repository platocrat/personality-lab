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
} from '../enums'


export type SkillDomainFactorType = {
  [key in SkillDomain]?: number // Number between 0 and 100
} 

export type FacetFactorType = { 
  [key in Facet]?: number // Number between 0 and 100
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

export type BessiSkillScoresType = {
  id?: string
  studyId?: string
  accessToken?: string
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
  gender: Gender | string | number
  usState: USState
  zipCode: string
  isParent: YesOrNo
  foreignCountry: string
  englishFluency: YesOrNo
  priorCompletion: YesOrNo
  socialClass: SocialClass
  raceOrEthnicity: RaceOrEthnicity[]
  currentMaritalStatus: CurrentMaritalStatus | string | number
  highestFormalEducation: HighestFormalEducation | string | number
  currentEmploymentStatus: CurrentEmploymentStatus | string | number
}

export type BessiUserResults__DynamoDB = {
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  demographics: BessiUserDemographics__DynamoDB
}