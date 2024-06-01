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
      <table className={ styles.bessi_assessment_table_body }>
        <tbody className={ styles.bessi_assessment_tbody }>
          <tr className={ styles.bessi_assessment_tr }>
            { skillsMapping.tableHeaders.map(( header: string, i: number) => (
              <Fragment 
                key={ `skills-scores-and-definitions-table-headers-${ i }` }
              >
                <th
                  className={ styles.bessi_assessment_th }
                  style={{ 
                    textAlign: 'center',
                    width: i === skillsMapping.tableHeaders.length - 1 
                      ? '70%' 
                      : '15%',
                  }} 
                >
                  <p>
                    <strong>
                      <span className={ styles.bessi_text1 }>
                        { header }
                        <br />
                        { `(0-100)` }
                      </span>
                    </strong>
                  </p>
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
                <td
                  className={ styles.bessi_assessment_td }
                  style={ { textAlign: 'center' } }
                >
                  <span className={ styles.bessi_header2 }>
                    { i === Object.keys(skillsMapping.domains).length - 1 
                      ? null
                      : (
                        <>
                          { domain }
                          <br />
                          { bessiSkillScores?.domainScores[domain] ?? 0 }
                        </>
                    )}
                  </span>
                </td>

                <td
                  className={ styles.bessi_assessment_td }
                  style={ { textAlign: 'center' } }
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
                      <p
                        style={ {
                          marginBottom: '12px',
                          lineHeight: '18px',
                        } }
                      >
                        <span className={ styles.bessi_text1 }>
                          <strong>
                            { facet }
                            <br />
                            { bessiSkillScores?.facetScores[facet] ?? 0 }
                          </strong>
                        </span>
                      </p>
                    </Fragment>
                  )) }
                </td>

                <td
                  className={ styles.bessi_assessment_td }
                  // align="left" 
                  style={ { textAlign: 'left' } }
                  valign="top"
                >
                  <div>
                    <span className={ styles.bessi_text1 }>
                      <strong>{ domain  }</strong>
                      <br />
                      <div 
                        style={ { 
                          marginBottom: '-4px', 
                          lineHeight: '1.2', 
                        } }
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
                      <p
                        style={ {
                          margin: '8px 0px 0px 0px'
                        } }
                      >
                        <span className={ styles.bessi_text1 }>
                          <em style={ { marginRight: '8px' } }>
                            { `${ facet }:` }
                          </em>
                          { skillsMapping.domains[domain].facets[facet] }
                        </span>
                      </p>
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