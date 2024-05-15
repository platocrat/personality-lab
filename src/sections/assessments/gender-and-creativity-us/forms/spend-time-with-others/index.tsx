// Externals
import { FC } from 'react'
import { useRouter } from 'next/navigation'
// Locals
import GeneralActivities from '@/components/Forms/GenderAndCreativityUs/GeneralActivities'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/level-of-agreement`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `spend-time-with-others`
const ACTIVITY_BANK_ID = `spendTimeWithOthers`
const QUESTION_TEXT = `Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are someone who likes to spend time with others? Please indicate the extent to which you agree or disagree with each statement. I am someone who...`


type SpendTimeWithOthersFormProps = {}



const SpendTimeWithOthersForm: FC<SpendTimeWithOthersFormProps> = ({ }) => {
  return (
    <>
      <GeneralActivities
        href={ href }
        buttonText={ BUTTON_TEXT }
        questionText={ QUESTION_TEXT }
        pageFragmentId={ PAGE_FRAGMENT_ID }
        activityBankId={ ACTIVITY_BANK_ID }
      />
    </>
  )
}


export default SpendTimeWithOthersForm