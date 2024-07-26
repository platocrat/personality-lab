// Externals
import { FC } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/BigFive/CreativityAndAchievementsWrapper'
// Utils
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'


const href = `${BIG_FIVE_ASSESSMENT_HREF}/creative-activities-and-achievements/arts-and-crafts`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Music`
const PAGE_FRAGMENT_ID = `music`
const ACTIVITY_BANK_ID = 'music'



type MusicFormProps = {}



const MusicForm: FC<MusicFormProps> = ({ }) => {
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


export default MusicForm