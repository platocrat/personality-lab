// Externals
import { FC } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/BigFive/CreativityAndAchievementsWrapper'
// Utils
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'


const href = `${BIG_FIVE_ASSESSMENT_HREF}/creative-activities-and-achievements/science-and-engineering`

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