// Locals
import BessiResultsExplanation from './explanation'
import BessiResultsStellarPlot from './stellar-plot'
import BessiWantToLearnMore from './want-to-learn-more'
import BessiResultsSkillsScoresAndDefinitions from './skills-scores-and-definitions'



const BessiAssessmentResultsSection = () => {
  return (
    <>
      <div style={ { maxWidth: '800px' } }>
        <BessiResultsExplanation />
        <BessiResultsStellarPlot />
        <BessiResultsSkillsScoresAndDefinitions />
        <BessiWantToLearnMore />
      </div>
    </>
  )
}

export default BessiAssessmentResultsSection