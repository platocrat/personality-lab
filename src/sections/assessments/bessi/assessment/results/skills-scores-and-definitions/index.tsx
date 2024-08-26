'use client'

// Externals
import { FC, Fragment, useContext } from 'react'
// Locals
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Constants
import { 
  getRangeLabel, 
  SKILLS_MAPPING, 
  FacetFactorType, 
  SkillDomainFactorType, 
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'




const getColorForScore = (score) => {
  if (score >= 0 && score <= 20) {
    return '#ff0000' // Red for very low
  } else if (score > 20 && score <= 40) {
    return '#ff8000' // Orange for low
  } else if (score > 40 && score <= 60) {
    return '#ffff00' // Yellow for medium
  } else if (score > 60 && score <= 80) {
    return '#80ff00' // Light green for high
  } else if (score > 80 && score <= 100) {
    return '#00ff00' // Green for very high
  } else {
    return '#000000' // Black for out of range (error case)
  }
}




const SkillsScoresAndDefinitionsTable: FC<{
  facetScores?: FacetFactorType,
  domainScores?: SkillDomainFactorType,
}> = ({
  facetScores,
  domainScores,
}) => {
  const { bessiSkillScores } = useContext(BessiSkillScoresContext)


  return (
    <div>
      { Object.keys(SKILLS_MAPPING.domains).map((domain: string, i: number) => (
        <div 
          key={ `skills-scores-and-definitions-${domain}-${i}` } 
          className={ styles.card }
          style={{
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div className={ styles.card_body }>
            <div className={ styles.card_item }>
              <div className={ styles.bessi_domain_header }>
                { domain }
                <span
                  className={ styles.bessi_definition_score }
                  style={ {
                    position: 'relative',
                    top: '-4px',
                    fontSize: 'clamp(14px, 2.5vw, 18px)'
                  } }
                >
                  { domainScores 
                    ? domainScores[domain] ?? 0 
                    : bessiSkillScores?.domainScores[domain] ?? 0 
                  }
                </span>
                {/* Score range label */}
                <div 
                  style={{ 
                    backgroundColor: getColorForScore(
                        domainScores
                          ? domainScores[domain] ?? 0
                          : bessiSkillScores?.domainScores[domain] ?? 0
                      ), 
                    borderRadius: '5px', 
                    padding: '0px 7.5px',
                    marginLeft: '14px',
                    position: 'relative',
                    top: '-1px',
                  }}
                >
                  <p 
                    style={{ 
                      color: 'white', 
                      fontWeight: '800', 
                      filter: 'drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.85))',
                      position: 'relative',
                      top: '4.5px',
                    }}
                  >
                    { 
                      getRangeLabel(
                        domainScores 
                          ? domainScores[domain] ?? 0 
                          : bessiSkillScores?.domainScores[domain] ?? 0
                      ) 
                    }
                  </p>
                </div>
              </div>
              <div className={ styles.bessi_definition }>
                <span className={ styles.bessi_definition_text }>
                  { SKILLS_MAPPING.domains[domain].description }
                </span>
              </div>
            </div>

            <div className={ styles.facets_grid }>
              { Object.keys(SKILLS_MAPPING.domains[domain].facets).map((facet: string, j: number) => (
                <div key={ `skills-scores-and-definitions-${domain}-${facet}-${j}` } className={ styles.card_item }>
                  <div className={ styles.bessi_definition }>
                    <strong 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'row' 
                      }}
                    >
                      { facet }

                      <span 
                        className={ styles.bessi_definition_score }
                        style={{
                          position: 'relative',
                          top: '-3px',
                        }}
                      >
                        { facetScores ? facetScores[facet] ?? 0 : bessiSkillScores?.facetScores[facet] ?? 0 }
                      </span>
                      
                      {/* Score range label */ }
                      <div
                        style={ {
                          backgroundColor: getColorForScore(
                            facetScores
                              ? facetScores[facet] ?? 0
                              : bessiSkillScores?.facetScores[facet] ?? 0
                          ),
                          borderRadius: '5px',
                          padding: '0px 7.5px',
                          marginLeft: '14px',
                          position: 'relative',
                        } }
                      >
                        <p
                          style={ {
                            color: 'white',
                            fontWeight: '800',
                            filter: 'drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.85))',
                            position: 'relative',
                            top: '2.5px',
                          } }
                        >
                          {
                            getRangeLabel(
                              facetScores
                                ? facetScores[facet] ?? 0
                                : bessiSkillScores?.facetScores[facet] ?? 0
                            )
                          }
                        </p>
                      </div>
                    </strong>
                    <span className={ styles.bessi_definition_text }>
                      { SKILLS_MAPPING.domains[domain].facets[facet] }
                    </span>
                  </div>
                </div>
              )) }
            </div>
          </div>
        </div>
      )) }
    </div>
  )
}




const BessiResultsSkillsScoresAndDefinitions: FC<{
  facetScores?: FacetFactorType,
  domainScores?: SkillDomainFactorType,
}> = ({
  facetScores,
  domainScores,
}) => {
  const title = `Skill Scores and Definitions`

  return (
    <div style={ { margin: '12px 0px 48px 0px' } }>
      <div style={ { margin: '18px' } }>
        <h3 style={ { fontSize: 'clamp(14px, 2.5vw, 16px)' } }>
          { title }
        </h3>
      </div>

      <SkillsScoresAndDefinitionsTable
        facetScores={ facetScores }
        domainScores={ domainScores }
      />
    </div>
  )
}


export default BessiResultsSkillsScoresAndDefinitions