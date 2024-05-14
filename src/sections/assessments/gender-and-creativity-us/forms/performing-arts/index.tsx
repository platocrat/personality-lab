// Externals
import { FC, Fragment } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievementsWrapper'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/science-and-engineering`

const BUTTON_TEXT = `Next`
const ACTIVITY_BANK_ID = `performingArts`
const PAGE_FRAGMENT_ID = `performing-arts`
const PAGE_TITLE = `Performing Arts (Theatre, Dance, Film)`



type PerformingArtsProps = {}



const PerformingArts: FC<PerformingArtsProps> = ({ }) => {
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


export default PerformingArts