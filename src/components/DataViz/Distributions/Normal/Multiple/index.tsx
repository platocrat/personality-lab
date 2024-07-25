import { FC } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
import SingleNormalDistributionChart from '@/components/DataViz/Distributions/Normal/Single'
// Utils
import { 
  calculateStats,
  FacetFactorType, 
  SkillDomainFactorType,
} from '@/utils'
import { definitelyCenteredStyle } from '@/theme/styles'


export type MultipleNormalDistributionDataType = {
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  populationFacetScores: { [key: string]: number[]  }
  populationDomainScores: { [key: string]: number[] }
}


type MultipleNormalDistributionsProps = {
  isSample: boolean
  isExample: boolean
  data: MultipleNormalDistributionDataType
}




const MultipleNormalDistributions: FC<MultipleNormalDistributionsProps> = ({ 
  data,
  isSample,
  isExample,
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
          <>
            <div>
              <div style={{ ...definitelyCenteredStyle }}>
                <p style={{ marginRight: '8px' }}>
                  { `Facet: ` }
                </p>
                <p>
                  { facet }
                </p>
              </div>
              <SingleNormalDistributionChart
                key={ `facet-${facet}` }
                mean={ mean }
                stddev={ stddev }
                score={ score as number ?? 0 }
              />
            </div>
          </>
        )
      }) }

      { Object.entries(domainScores).map(([domain, score]) => {
        const { mean, stddev } = domainScoresStats[
          domain as keyof SkillDomainFactorType
        ]

        return (
          <>
            <div>
              <div style={{ ...definitelyCenteredStyle }}>
                <p style={{ marginRight: '8px' }}>
                  { `Domain: ` }
                </p>
                <p>
                  { domain }
                </p>
              </div>
              <SingleNormalDistributionChart
                key={ `domain-${domain}` }
                mean={ mean }
                stddev={ stddev }
                score={ score as number ?? 0 }
              />
            </div>
          </>
        )
      }) }
    </div>
  )
}


export default MultipleNormalDistributions
