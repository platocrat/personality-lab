// Externals
import { createContext } from 'react'
// Locals
// Context Types
import { BessiSkillScoresContextType } from './types'
// Utils
import { BessiSkillScoresType, Facet, SkillDomain } from '@/utils'



const INIT_BESSI_SKILL_SCORES: BessiSkillScoresType = {
  id: '',
  studyId: '',
  accessToken: '',
  facetScores: Object.values(Facet).reduce(
    (acc, facet) => {
      acc[facet] = 0
      return acc
    }, {} as { [key in Facet]: number }
  ), // Initialize all facet scores with 0
  domainScores: Object.values(SkillDomain).reduce(
    (acc, domain) => {
      acc[domain] = 0
      return acc
    }, {} as { [key in SkillDomain]: number }
  ), // Initialize all domain scores with 0
}



const INIT_BESSI_SCORES_CONTEXT: BessiSkillScoresContextType = {
  bessiSkillScores: INIT_BESSI_SKILL_SCORES,
  setBessiSkillScores: () => {},
}




export const BessiSkillScoresContext = createContext<BessiSkillScoresContextType>(
  INIT_BESSI_SCORES_CONTEXT
)