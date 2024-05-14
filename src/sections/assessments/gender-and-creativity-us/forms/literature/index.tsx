// Externals
import { FC, Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Locals
import CreativityAndAchievementsFormWrapper from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievementsWrapper'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${ GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF }/creative-activities-and-achievements/music`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Literature`
const PAGE_FRAGMENT_ID = `literature`
const ACTIVITY_BANK_ID = 'literature'



type LiteratureFormProps = {}



const LiteratureForm: FC<LiteratureFormProps> = ({ }) => {
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


export default LiteratureForm