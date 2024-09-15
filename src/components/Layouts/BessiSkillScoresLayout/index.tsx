// Externals
import { ReactNode, FC, useState } from 'react'
// Locals
import { BessiSkillScoresType, Facet, SkillDomain } from '@/utils'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'



type BessiSkillScoresLayoutProps = {
  children: ReactNode
}



const BessiSkillScoresLayout: FC<BessiSkillScoresLayoutProps> = ({ 
  children,
}) => {
  const [
    bessiSkillScores,
    setBessiSkillScores
  ] = useState<BessiSkillScoresType | null>(null)


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