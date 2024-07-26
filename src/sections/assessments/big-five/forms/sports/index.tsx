// Externals
import { FC } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/BigFive/CreativityAndAchievementsWrapper'
// Utils
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/creative-activities-and-achievements/visual-arts`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Sports`
const ACTIVITY_BANK_ID = `sports`
const PAGE_FRAGMENT_ID = `sports`



type ScienceAndEngineeringProps = {}



const ScienceAndEngineering: FC<ScienceAndEngineeringProps> = ({ }) => {
  return (
    <>
      <CreativityAndAchievementsFormWrapper
        href={ href }
        pageTitle={ PAGE_TITLE }
        buttonText={ BUTTON_TEXT }
        activityBankId={ ACTIVITY_BANK_ID }
        pageFragmentId={ PAGE_FRAGMENT_ID }
      />
    </>
  )
}


export default ScienceAndEngineering