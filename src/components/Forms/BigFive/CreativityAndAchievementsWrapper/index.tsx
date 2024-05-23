'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
// Locals
import CreativityAndAchievementsForm from '@/components/Forms/BigFive/CreativityAndAchievements'
// Utils
import { 
  BIG_FIVE_ACTIVITY_BANK,
  BIG_FIVE_ACTIVITY_BANK_LEGEND,
  BIG_FIVE_ASSESSMENT_HREF, 
  BIG_FIVE_FRAGMENT_ID_PREFACES,
} from '@/utils'



type CreativityAndAchievementsFormWrapperProps = {
  href: string
  pageTitle: string
  buttonText: string
  activityBankId: string
  pageFragmentId: string
}



const CreativityAndAchievementsFormWrapper: FC<CreativityAndAchievementsFormWrapperProps> = ({
  href,
  pageTitle,
  buttonText,
  activityBankId,
  pageFragmentId,
}) => {
  // Hooks
  const router = useRouter()
  // Custom states
  const [
    engagementLevelResponses,
    setEngagementLevelResponses
  ] = useState<any>({})
  const [ userResponses, setUserResponses ] = useState<any>({})
  const [ activityResponses, setActivityResponses ] = useState<any>({})
  // Number states
  const [ yearsEngagedIn, setYearsEngagedIn ] = useState<number>(0)
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0)
  // Boolean states
  const [isSubmitting, setIsSubmitting ] = useState<boolean>(false)
  const [ hasSubmitted, setHasSubmitted ] = useState<boolean>(false)


  const questions = BIG_FIVE_ACTIVITY_BANK[
    activityBankId
  ]
  const choices = BIG_FIVE_ACTIVITY_BANK_LEGEND[
    activityBankId
  ]


  const FRAGMENT_KEY_PREFACE = BIG_FIVE_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )



  const onActivityChange = (e: any, questionIndex: number): void => {
    const { name, value } = e.target
    setActivityResponses({ ...activityResponses, [`${ name }`]: value })

    // Move to the next question after a short delay
    if (questionIndex < questions.length - 1) {
      const timeout = 28 // 300ms delay for the transition effect

      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1)
      }, timeout)
    }
  }


  const onEngagementLevelChange = (e: any): void => {
    const { name, value, checked } = e.target

    if (!checked) {
      const _ = { ...engagementLevelResponses }
      delete _[name]
      setEngagementLevelResponses(_)
    } else {
      setEngagementLevelResponses({
        ...engagementLevelResponses,
        [name]: checked
      })
    }
  }



  const onYearsEngagedInChange = (e: any): void => {
    const { value } = e.target
    setYearsEngagedIn(value)
  }



  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    setIsSubmitting(true)

    const userResponses = {
      yearsEngagedIn,
      activityResponses,
      engagementLevelResponses,
    }

    setUserResponses(userResponses)

    await storeResponsesInLocalStorage(userResponses)
    
    setHasSubmitted(true)

    router.push(href)
  }



  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 300)
  }


  // Test outputs from onChange event handlers
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponse: `, userResponses)
  }, [userResponses])





  return (
    <>
      <CreativityAndAchievementsForm
        href={ href }
        pageTitle={ pageTitle }
        pageFragmentId={ pageFragmentId }
        state={{
          isSubmitting: isSubmitting,
          hasSubmitted: hasSubmitted,
        }}
        onEventHandlers={{
          onSubmit: handleOnSubmit,
          onChange: {
            onActivityChange,
            onEngagementLevelChange,
            onYearsEngagedInChange
          },
        }}
        questionnaire={{
          choices: choices,
          questions: questions,
          currentQuestionIndex: currentQuestionIndex,
        }}
      />
    </>
  )
}


export default CreativityAndAchievementsFormWrapper