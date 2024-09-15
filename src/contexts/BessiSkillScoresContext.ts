// Externals
import { createContext } from 'react'
// Locals
// Context Types
import { BessiSkillScoresContextType } from './types'
// Utils
import { BessiSkillScoresType, Facet, SkillDomain } from '@/utils'



const INIT_BESSI_SCORES_CONTEXT: BessiSkillScoresContextType = {
  bessiSkillScores: null,
  setBessiSkillScores: () => {},
}




export const BessiSkillScoresContext = createContext<BessiSkillScoresContextType>(
  INIT_BESSI_SCORES_CONTEXT
)