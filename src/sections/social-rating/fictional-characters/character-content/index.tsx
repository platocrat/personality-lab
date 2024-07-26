// Externals
import { Fragment } from 'react'
// Locals
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Utils
import { CharacterType } from '@/utils'
// CSS
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'




type CharacterContentProps = {
  characters: CharacterType[]
}



const CharacterContent = ({
  characters,
}) => {
  return (
    <>
      { characters.map((character, index) => (
        <Fragment key={ index }>
          <div key={ index } className={ styles['character-card'] }>
            <div
              style={ {
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '12px',
              } }
            >
              <h3>
                { `${character.name} (${index + 1}/${characters.length})` }
              </h3>
              <em>
                <h4>
                  { `${character.group}` }
                </h4>
              </em>
            </div>

            <p style={ { fontSize: 'clamp(11px, 2.5vw, 14px)' } }>
              { character.description }
            </p>

            <BessiResultsVisualization
              isExample={ true }
              facetScores={ character.facetScores }
              domainScores={ character.domainScores }
            />

            <BessiResultsSkillsScoresAndDefinitions
              facetScores={ character.facetScores }
              domainScores={ character.domainScores }
            />
          </div>
        </Fragment>
      )) }
    </>
  )
}


export default CharacterContent