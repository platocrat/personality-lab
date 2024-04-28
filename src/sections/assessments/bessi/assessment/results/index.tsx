// Locals
import BessiResultsExplanation from './explanation'
import BessiWantToLearnMore from './want-to-learn-more'
import BessiResultsVisualization from './bessi-results-visualization'
import BessiShareResultsButton from '../../../../../components/Buttons/BESSI/ShareResultsButton'
import BessiResultsSkillsScoresAndDefinitions from './skills-scores-and-definitions'



const BessiAssessmentResultsSection = () => {
  return (
    <>
      <div style={ { maxWidth: '800px' } }>
        <BessiResultsExplanation />
        <BessiResultsVisualization />
        <BessiShareResultsButton  />
        <BessiResultsSkillsScoresAndDefinitions />
        <BessiWantToLearnMore />
      </div>
    </>
  )
}

export default BessiAssessmentResultsSection