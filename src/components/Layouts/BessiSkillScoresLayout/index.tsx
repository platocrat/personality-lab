// Externals
import { ReactNode, FC, useState } from 'react'
// Locals
import { BessiSkillScoresType, Facet, SkillDomain } from '@/utils'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'



type BessiSkillScoresLayoutProps = {
  children: ReactNode
}



const INIT_BESSI_SKILL_SCORES = {
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




const BessiSkillScoresLayout: FC<BessiSkillScoresLayoutProps> = ({ 
  children,
}) => {
  const [
    bessiSkillScores,
    setBessiSkillScores
  ] = useState<BessiSkillScoresType>(INIT_BESSI_SKILL_SCORES)


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


export default BessiSkillScoresLayout