import { FC } from 'react'
// Locals
import SingleNormalDistributionChart from '@/components/DataViz/Distributions/Normal/SingleNormal'
// Utils
import { 
  calculateStats,
  FacetFactorType, 
  SkillDomainFactorType,
} from '@/utils'


export type MultipleNormalDistributionDataType = {
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  populationFacetScores: { [key: string]: number[]  }
  populationDomainScores: { [key: string]: number[] }
}


type MultipleNormalDistributionsProps = {
  isSample: boolean
  data: MultipleNormalDistributionDataType
}




const MultipleNormalDistributions: FC<MultipleNormalDistributionsProps> = ({ 
  data,
  isSample,
}) => {
  const { 
    facetScores, 
    domainScores, 
    populationFacetScores, 
    populationDomainScores,
  } = data

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
