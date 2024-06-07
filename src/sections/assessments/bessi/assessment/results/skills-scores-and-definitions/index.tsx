'use client'

// Externals
import { Fragment, useContext } from 'react'
// Locals
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Constants
import { skillsMapping } from '@/utils'
// CSS
import styles from '@/app/page.module.css'





const SkillsScoresAndDefinitionsTable = () => {
  const { bessiSkillScores } = useContext(BessiSkillScoresContext)


  return (
    <>
      <table className={ styles.bessi_assessment_table }>
        <tbody>
          <tr>
            { skillsMapping.tableHeaders.map(( header: string, i: number) => (
              <Fragment 
                key={ `skills-scores-and-definitions-table-headers-${ i }` }
              >
                <th
                  style={{ 
                    textAlign: 'center',
                    width: i === skillsMapping.tableHeaders.length - 1 
                      ? '70%' 
                      : '15%',
                  }} 
                >
                  <div>
                    <strong>
                      <span className={ styles.bessi_text1 }>
                        { header }
                        <br />
                        { `(0-100)` }
                      </span>
                    </strong>
                  </div>
                </th>
              </Fragment>
            )) }
          </tr>
          
          { Object.keys(skillsMapping.domains).map(( 
            domain: string, 
            i: number 
          ) => (
            <Fragment key={ `skills-scores-and-definitions-${ domain }-${ i }` }>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <span className={ styles.bessi_header2 }>
                    { i === Object.keys(skillsMapping.domains).length - 1 
                      ? null
                      : (
                        <>
                          <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                            { domain }
                          </p>
                          <br />
                          <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                            { bessiSkillScores?.domainScores[domain] ?? 0 }
                          </p>
                        </>
                    )}
                  </span>
                </td>

                <td
                  style={ { textAlign: 'center' } }
                  className={ styles.bessi_assessment_td }
                >
                  { Object.keys(skillsMapping.domains[domain].facets).map((
                    facet: string,
                    j: number
                  ) => (
                    <Fragment 
                      key={ 
                        `skills-scores-and-definitions-${ domain }-${ facet }-${i}`
                      }
                    >
                      <div
                        style={{
                          lineHeight: '18px',
                          marginBottom: '24px',
                        }}
                      >
                        <span className={ styles.bessi_text1 }>
                          <strong 
                            style={{ fontSize: 'clamp(11px, 2.5vw, 14px)' }}
                          >
                            { facet }
                            <br />
                            { bessiSkillScores?.facetScores[facet] ?? 0 }
                          </strong>
                        </span>
                      </div>
                    </Fragment>
                  )) }
                </td>

                <td
                  valign="top"
                  className={ styles.bessi_assessment_td }
                  style={{ textAlign: 'left' }}
                >
                  <div>
                    <span className={ styles.bessi_text1 }>
                      <strong 
                        style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}
                      >
                        { domain  }
                      </strong>
                      <br />
                      <div 
                        style={{ 
                          marginBottom: '4px', 
                          lineHeight: '1.2',
                          fontSize: 'clamp(10px, 2.5vw, 14px)'
                        }}
                      >
                        { skillsMapping.domains[domain].description }
                      </div>
                    </span>
                  </div>

                  { Object.keys(skillsMapping.domains[domain].facets).map((
                    facet: string,
                    k: number
                  ) => (
                    <Fragment 
                      key={ 
                        `skills-scores-and-definitions-${ domain }-${ facet }-${ k }`
                      }
                    >
                      <div
                        style={ {
                          margin: '8px 0px 24px 0px'
                        } }
                      >
                        <span className={ styles.bessi_text1 }>
                          <em 
                            style={{ 
                              marginRight: '8px',
                              fontSize: 'clamp(11px, 2.5vw, 14px)'
                            }}
                          >
                            { `${ facet }:` }
                          </em>
                          <p
                            style={ { fontSize: 'clamp(11px, 2.5vw, 14px)' }}
                          >
                            { skillsMapping.domains[domain].facets[facet] }
                          </p>
                        </span>
                      </div>
                    </Fragment>
                  )) }
                </td>
              </tr>    
            </Fragment>
          )) }

        </tbody>
      </table>
    </>
  )
}

const BessiResultsSkillsScoresAndDefinitions = () => {
  const title = `Skill Scores and Definitions`

  return (
    <>
      <div style={{ margin: '48px 0px 0px 0px' }}>
        <div style={{ margin: '18px 0px 18px 0px' }}>
          <h3>{ title }</h3>
        </div>

        <SkillsScoresAndDefinitionsTable />
      </div>
    </>
  )
}

export default BessiResultsSkillsScoresAndDefinitions