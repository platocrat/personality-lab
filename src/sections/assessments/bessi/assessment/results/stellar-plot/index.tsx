'use client'

// Externals
import { Dispatch, SetStateAction, useContext } from 'react'
// Locals
import StellarPlot from '@/components/StellarPlot'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Enums
import { SkillDomain } from '@/utils/bessi/types/enums'
// Types
import { BessiSkillScores, SkillDomainFactorType } from '@/utils/bessi/types'
import { definitelyCenteredStyle } from '@/theme/styles'



type BessiSkillScoresContextType = {
  bessiSkillScores: BessiSkillScores | null,
  setBessiSkillScores: Dispatch<SetStateAction<BessiSkillScores | null>>
}



const BessiResultsStellarPlot = () => {
  // Contexts
  const { bessiSkillScores } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )

  const title = `Stellar Plot`

  const data = Object.entries(
    bessiSkillScores?.domainScores as SkillDomainFactorType
  ).map(([key, value]) => ({
    axis: key,
    value: value / 100
  }))

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