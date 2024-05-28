// Externals
import { FC } from 'react'
// Locals
import GeneralActivities from '@/components/Forms/BigFive/GeneralActivities'
// Utils
import {
  BIG_FIVE_ASSESSMENT_HREF
} from '@/utils'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/creative-activities-and-achievements/instructions`

const BUTTON_TEXT = `Next`
const ACTIVITY_BANK_ID = `levelOfAgreement`
const PAGE_FRAGMENT_ID = `level-of-agreement`
const QUESTION_TEXT = `Please indicate your level of agreement to the following statements using the options provided`


type LevelOfAgreementFormProps = {}



const LevelOfAgreementForm: FC<LevelOfAgreementFormProps> = ({ }) => {
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


export default LevelOfAgreementForm