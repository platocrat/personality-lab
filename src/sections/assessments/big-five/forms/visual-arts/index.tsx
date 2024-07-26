// Externals
import { FC } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/BigFive/CreativityAndAchievementsWrapper'
// Utils
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/creative-activities-and-achievements/performing-arts`

const BUTTON_TEXT = `Next`
const ACTIVITY_BANK_ID = `visualArts`
const PAGE_TITLE = `Visual Arts (Graphics, Painting, Sculpting, Architecture)`
const PAGE_FRAGMENT_ID = `visual-arts`



type VisualArtsFormProps = {}



const VisualArtsForm: FC<VisualArtsFormProps> = ({ }) => {
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


export default VisualArtsForm