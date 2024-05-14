// Externals
import { FC, Fragment } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievementsWrapper'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/five-most-creative-achievements`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Science & Engineering`
const ACTIVITY_BANK_ID = `scienceAndEngineering`
const PAGE_FRAGMENT_ID = `science-and-engineering`



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