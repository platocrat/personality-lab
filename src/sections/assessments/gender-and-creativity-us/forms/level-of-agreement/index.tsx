// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import GeneralActivities from '@/components/Forms/GenderAndCreativityUs/GeneralActivities'
// Utils
import {
  getInputLabels,
  radioOrCheckboxInputStyle,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK,
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND,
} from '@/utils'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/instructions`

const BUTTON_TEXT = `Next`
const ACTIVITY_BANK_ID = `levelOfAgreement`
const PAGE_FRAGMENT_ID = `level-of-agreement`
const QUESTION_TITLE = `Please indicate your level of agreement to the following statements using the options provided`


type SpendTimeWithOthersFormProps = {}



const SpendTimeWithOthersForm: FC<SpendTimeWithOthersFormProps> = ({ }) => {
  return (
    <>
      <GeneralActivities
        href={ href }
        buttonText={ BUTTON_TEXT }
        questionTitle={ QUESTION_TITLE }
        pageFragmentId={ PAGE_FRAGMENT_ID }
        activityBankId={ ACTIVITY_BANK_ID }
      />
    </>
  )
}


export default SpendTimeWithOthersForm