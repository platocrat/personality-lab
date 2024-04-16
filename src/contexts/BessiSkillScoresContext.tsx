'use client';

// Internals
import { createContext, useState } from 'react'
// Locals
import { BessiSkillScores } from '@/utils/bessi/types'


export const BessiSkillScoresContext = createContext<any>(null)


export const BessiSkillScoresContextComponent = ({ children }) => {
  const [
    bessiSkillScores,
    setBessiSkillScores
  ] = useState<BessiSkillScores | null>(null)

  return (
    <>
      <BessiSkillScoresContext.Provider
          value={ {
            bessiSkillScores,
            setBessiSkillScores,
          } }
      >
        { children }
      </BessiSkillScoresContext.Provider>
    </>
  )
}