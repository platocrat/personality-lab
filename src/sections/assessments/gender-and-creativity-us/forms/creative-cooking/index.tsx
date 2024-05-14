// Externals
import { FC, Fragment } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievementsWrapper'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/visual-arts`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Creative Cooking`
const ACTIVITY_BANK_ID = `creativeCooking`
const PAGE_FRAGMENT_ID = `creative-cooking`



type CreativeCookingFormProps = {}



const CreativeCookingForm: FC<CreativeCookingFormProps> = ({ }) => {
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


export default CreativeCookingForm