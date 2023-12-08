import { Facet, SkillDomain } from './enums'


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