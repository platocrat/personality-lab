// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { BessiSkillScoresType } from '@/utils'


export type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScoresType | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScoresType | null>>
}