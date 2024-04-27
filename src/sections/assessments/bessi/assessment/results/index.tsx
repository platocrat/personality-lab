// Locals
import BessiResultsExplanation from './explanation'
import BessiWantToLearnMore from './want-to-learn-more'
import BessiResultsVisualization from './bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from './skills-scores-and-definitions'
import BessiShareResults from './bessi-results-visualization/share-results'



const BessiAssessmentResultsSection = () => {
  return (
    <>
      <div style={ { maxWidth: '800px' } }>
        <BessiResultsExplanation />
        <BessiResultsVisualization />
        <BessiShareResults  />
        <BessiResultsSkillsScoresAndDefinitions />
        <BessiWantToLearnMore />
      </div>
    </>
  )
}

export default BessiAssessmentResultsSection