import BessiResultsExplanation from './explanation'
import BessiWantToLearnMore from './want-to-learn-more'
import BessiResultsSkillsScoresAndDefinitions from './skills-scores-and-definitions'


const BessiAssessmentResultsSection = () => {
  return (
    <>
      <div style={ { maxWidth: '800px' } }>
        <BessiResultsExplanation />   
        <BessiResultsSkillsScoresAndDefinitions />
        <BessiWantToLearnMore />
      </div>
    </>
  )
}

export default BessiAssessmentResultsSection