import { FC } from 'react'
// Locals
import SingleNormalDistributionChart from '../SingleNormal'
// Utils
import { 
  calculateStats,
  FacetFactorType, 
  SkillDomainFactorType,
} from '@/utils'


type InputData = {
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  populationFacetScores: Record<string, number[]>
  populationDomainScores: Record<string, number[]>
}


type MultipleNormalDistributionsProps = {
  inputData: InputData
  isSample: boolean
}




const MultipleNormalDistributions: FC<MultipleNormalDistributionsProps> = ({ 
  inputData, 
  isSample 
}) => {
  const { 
    facetScores, 
    domainScores, 
    populationFacetScores, 
    populationDomainScores,
  } = inputData

  const facetScoresStats = calculateStats(populationFacetScores, isSample)
  const domainScoresStats = calculateStats(populationDomainScores, isSample)


  return (
    <div>
      { Object.entries(facetScores).map(([facet, score]) => {
        const { mean, stddev } = facetScoresStats[
          facet as keyof FacetFactorType
        ]

        return (
          <SingleNormalDistributionChart
            key={ `facet-${facet}` }
            mean={ mean }
            stddev={ stddev }
            score={ score as number ?? 0 }
          />
        )
      }) }

      { Object.entries(domainScores).map(([domain, score]) => {
        const { mean, stddev } = domainScoresStats[
          domain as keyof SkillDomainFactorType
        ]

        return (
          <SingleNormalDistributionChart
            key={ `domain-${domain}` }
            mean={ mean }
            stddev={ stddev }
            score={ score as number ?? 0 }
          />
        )
      }) }
    </div>
  )
}


export default MultipleNormalDistributions
