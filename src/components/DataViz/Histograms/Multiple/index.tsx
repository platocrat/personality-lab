// Externals
import { FC, useLayoutEffect } from 'react'
// Locals
import Histogram from '@/components/DataViz/Histograms/Single'
import { getDummyPopulationBessiScores, FacetFactorType, SkillDomainFactorType } from '@/utils'
import { UserForDataVizType } from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'


type Auth0User = any


type MultipleHistogramsProps = {
  userData: UserForDataVizType,
  auth0: {
    user: Auth0User,
    isLoading: boolean
  }
}


const MultipleHistograms: FC<MultipleHistogramsProps> = ({
  auth0,
  userData,
}) => {
  /**
   * @todo Get real data from DynamoDB
   */
  const histogramPopulationData = {
    facetScores: getDummyPopulationBessiScores(100, 'facet'),
    domainScores: getDummyPopulationBessiScores(100, 'domain')
  }

  console.log(`histogramPopulationData: `, histogramPopulationData)



  useLayoutEffect(() => {

  }, [ auth0.isLoading, auth0.user ])


  return (
    <>
      { Object.entries(
        userData.facetScores
      ).map(([key, scoresArray]) => (
        <div key={ `facet-${key}` }>
          <Histogram
            data={ scoresArray }
            title={ `Facet Score: ${key}` }
            score={ userData.facetScores[key] }
          />
        </div>
      )) }
      { Object.entries(
        histogramPopulationData.domainScores
      ).map(([key, scoresArray]) => (
        <div key={ `domain-${key}` }>
          <Histogram
            data={ scoresArray }
            title={ `Domain Score: ${key}` }
            score={ userData.domainScores[key] }
          />
        </div>
      )) }
    </>
  )
}


export default MultipleHistograms