// Externals
import { FC, Fragment } from 'react'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/BigFive/CreativityAndAchievementsWrapper'
// Utils
import { BIG_FIVE_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${ BIG_FIVE_ASSESSMENT_HREF }/creative-activities-and-achievements/creative-cooking`

const BUTTON_TEXT = `Next`
const ACTIVITY_BANK_ID = `artsAndCrafts`
const PAGE_TITLE = `Arts-and-Crafts`
const PAGE_FRAGMENT_ID = `arts-and-crafts`



type ArtsAndCraftsFormProps = {}



const ArtsAndCraftsForm: FC<ArtsAndCraftsFormProps> = ({ }) => {
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


export default ArtsAndCraftsForm