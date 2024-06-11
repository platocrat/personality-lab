// Externals
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import Histogram from '@/components/DataViz/Histograms/Single'
// Utils
import { 
  FacetFactorType, 
  SkillDomainFactorType,
  getDummyPopulationBessiScores, 
} from '@/utils'
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
  const [view, setView] = useState<'domain' | 'facet'>('domain')


  /**
   * @todo Get real data from DynamoDB
   */
  const histogramPopulationData = {
    facetScores: getDummyPopulationBessiScores(100, 'facet'),
    domainScores: getDummyPopulationBessiScores(100, 'domain')
  }

  console.log(`histogramPopulationData: `, histogramPopulationData)

  const handleOnChangeHistogramView = (e: any) => {
    setView(e.target.value as 'domain' | 'facet') 
  }


  useLayoutEffect(() => {

  }, [ auth0.isLoading, auth0.user ])


  return (
    <>
      <div style={{ marginTop: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <select
            id='view-select'
            value={ view }
            onChange={ handleOnChangeHistogramView }
          >
            <option value='domain'>
              { `Domain Scores` }
            </option>
            <option value='facet'>
              { `Facet Scores` }
            </option>
          </select>
        </div>
      </div>
      { view === 'facet' && Object.entries(
        histogramPopulationData.facetScores
      ).map(([key, scoresArray]) => (
        <div key={ `facet-${key}` }>
          <Histogram
            data={ scoresArray }
            title={ `Facet Score: ${key}` }
            score={ userData.facetScores[key] }
          />
        </div>
      )) }
      { view === 'domain' && Object.entries(
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