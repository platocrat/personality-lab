// Externals
import { FC } from 'react'
// Locals
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsExplanation from '@/sections/assessments/bessi/assessment/results/explanation'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
import BessiWantToLearnMore from '@/sections/assessments/bessi/assessment/results/want-to-learn-more'
// Types
import { BessiSkillScores } from '@/utils/bessi/types'



type BessiUserSharedResultsType = {
  results: BessiSkillScores | null
  error: string
}


const BessiUserSharedResults: FC<BessiUserSharedResultsType> = ({ 
  error,
  results,
}) => {


  return (
    <>
      { error ? (
        <>
          <div style={ { maxWidth: '800px' } }>
            <div>{ error }</div>
          </div>
        </>
        ) : (
        <div style={ { maxWidth: '800px' } }>
          <BessiResultsExplanation />
          <BessiResultsVisualization />

          <BessiResultsSkillsScoresAndDefinitions />
          <BessiWantToLearnMore />
        </div>
      ) }
    </>
  )
}


export async function getServerSideProps({ params }) {
  const { token } = params

  const response = await fetch(`./api/results?token=${token}`)
  const data = await response.json()

  if (!data || data.error) {
    return { 
      props: { 
        error: 'Results not found or access denied.' 
      } 
    }
  }

  return { 
    props: { 
      results: data
    }
  }
}


export default BessiUserSharedResults