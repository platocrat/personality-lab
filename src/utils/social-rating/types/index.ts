// Locals
import { FacetFactorType, SkillDomainFactorType } from '@/utils/assessments'



export type CharacterType = {
  name: string
  group: string
  description: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
}


export type GeneratedCharacterType = {
  group: string
  name: string
  description: string
  responses: {
    response: number
    id: number
    activity: string
  }[]
}[]
