'use client'

// Externals
import { 
  Dispatch, 
  useState,
  useContext, 
  SetStateAction, 
  useLayoutEffect,
  useMemo,
} from 'react'
// Locals
import StellarPlot from '@/components/DataViz/StellarPlot'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Enums
import { SkillDomain } from '@/utils/bessi/types/enums'
// Types
import { BessiSkillScores, SkillDomainFactorType } from '@/utils/bessi/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import { title } from 'process'



type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScoresContextType | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScoresContextType | null>>
}



const BessiResultsStellarPlot = () => {
  // Contexts
  const { bessiSkillScores } = useContext(BessiSkillScoresContext)

  const title = `Stellar Plot`

  console.log(`bessiSkillScores: `, bessiSkillScores)

  
  const data = useMemo(() => {
    return Object.entries(
      bessiSkillScores?.domainScores as SkillDomainFactorType
    ).map(([key, value]) => ({
      axis: key,
      value: value / 100
    }))
  }, [ bessiSkillScores ])



  return (
    <>
      <div style={{ margin: '24px' }}>
        <h3 style={ definitelyCenteredStyle }>{ title }</h3>
        <StellarPlot data={ data } />
      </div>
    </>
  )
}

export default BessiResultsStellarPlot