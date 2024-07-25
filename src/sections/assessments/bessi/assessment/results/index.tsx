// Locals
import BessiResultsExplanation from './explanation'
import BessiWantToLearnMore from './want-to-learn-more'
import BessiResultsVisualization from './bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from './skills-scores-and-definitions'
import { definitelyCenteredStyle } from '@/theme/styles'



const BessiAssessmentResultsSection = () => {
  return (
    <>
      <div style={{ maxWidth: '800px' }}>
        <BessiResultsExplanation />
        <BessiResultsVisualization />
        <BessiResultsSkillsScoresAndDefinitions />
        <BessiWantToLearnMore />
      </div>
    </>
  )
}

export default BessiAssessmentResultsSection