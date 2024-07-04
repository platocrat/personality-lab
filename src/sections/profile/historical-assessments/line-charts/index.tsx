// Externals
import { FC, useCallback } from 'react'
// Locals
import { FACET_FEEDBACK } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'




type LineChartsProps = {
  formatKey
  facetRefs
  domainRefs
  facetChartData
  domainChartData  
}




const LineCharts: FC<LineChartsProps> = ({
  formatKey,
  facetRefs,
  domainRefs,
  facetChartData,
  domainChartData,
}) => {
  const facetDescriptions = useCallback((data): string => {
    const facet = FACET_FEEDBACK[data.key]
    let _ = ''

    if (facet) {
      const valuesLength = data.values.length - 1
      const mostRecentScore = data.values[valuesLength].score

      if (mostRecentScore >= 70) {
        _ = facet['top-third']
      } else if (mostRecentScore < 70 && mostRecentScore >= 40) {
        _ = facet['middle']
      } else if (mostRecentScore < 40) {
        _ = facet['bottom-third']
      } else {
        _ = ''
      }

      return _
    }

    return _
  }, [])




  return (
    <>
      {/* Title */}
      <div>
        <h3 style={{ margin: '12px 0px', textAlign: 'center' }}>
          { `Historical Line Charts of Domain and Facet Scores` }
        </h3>  
      </div>
      {/* Historical Line Charts */ }
      <div>
        {/* Domain Scores */}
        <div>
          <div style={ definitelyCenteredStyle }>
            <h2 style={ { fontSize: 'clamp(13px, 2vw, 16px)' } }>
              { `Domain Scores` }
            </h2>
          </div>
          <div style={ { display: 'flex', flexWrap: 'wrap' } }>
            { domainChartData.map(data => (
              <div
                key={ data.key }
                style={ { display: 'flex', width: '100%' } }
              >
                <div style={ { flex: 1, textAlign: 'center' } }>
                  <strong>
                    <p style={ { fontSize: 'clamp(9px, 2vw, 15px)' } }>
                      { `Domain: ${formatKey(data.key)}` }
                    </p>  
                  </strong>
                </div>
                <div style={ { flex: 1 } }>
                  <div
                  style={{
                    maxWidth: 'none',
                  }}
                    className={ dataVizStyles.svgContainer }
                    ref={ (el: any) => domainRefs.current[data.key] = el }
                  />
                </div>
              </div>
            )) }
          </div>
        </div>
        {/* Facet Scores */}
        <div>
          <div style={ definitelyCenteredStyle }>
            <h2 style={ { fontSize: 'clamp(13px, 2vw, 16px)' } }>
              { `Facet Scores` }
            </h2>
          </div>
          <div style={ { display: 'flex', flexWrap: 'wrap' } }>
            { facetChartData.map(data => (
              <div
                key={ data.key }
                style={ { display: 'flex', width: '100%' } }
              >
                <div style={ { flex: 1, textAlign: 'center' } }>
                  <strong>
                    <p style={ { fontSize: 'clamp(9px, 2vw, 15px)' } }>
                      { `Facet: ${formatKey(data.key)}` }
                    </p>
                  </strong>
                  <div
                    style={ {
                      marginTop: '4px',
                      padding: '4px 8px',
                    } }
                  >
                    <p
                      style={ {
                        textAlign: 'left',
                        fontSize: 'clamp(9px, 2vw, 13px)'
                      } }
                    >
                      { facetDescriptions(data) }
                    </p>
                  </div>
                </div>
                <div style={ { flex: 1 } }>
                  <div
                    className={ dataVizStyles.svgContainer }
                    style={{
                      maxWidth: 'none',
                    }}
                    ref={ (el: any) => facetRefs.current[data.key] = el }
                  />
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>
    </>
  )
}

export default LineCharts