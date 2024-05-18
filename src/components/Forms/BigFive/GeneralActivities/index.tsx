'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useEffect, useLayoutEffect, useState } from 'react'
// Locals
import FormButton from '@/components/Buttons/Form'
import Spinner from '@/components/Suspense/Spinner'
import Questionnaire from '@/components/Questionnaire'
import { RadioOrCheckboxInput } from '@/components/Input'
import SubmitFormButton from '@/components/Buttons/Form'
// Utils
import {
  getInputLabels,
  radioOrCheckboxInputStyle,
  wellnessRatingDescriptions,
  BIG_FIVE_ACTIVITY_BANK,
  BIG_FIVE_ASSESSMENT_HREF,
  BIG_FIVE_ACTIVITY_BANK_LEGEND,
  BIG_FIVE_FRAGMENT_ID_PREFACES,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type GeneralActivitiesProps = {
  href: string
  buttonText: string
  questionText: string
  pageFragmentId: string
  activityBankId: string
}




const GeneralActivities: FC<GeneralActivitiesProps> = ({
  href,
  buttonText,
  questionText,
  pageFragmentId,
  activityBankId,
}) => {
  // Hooks
  const router = useRouter()

  // React states
  const [
    isEndOfQuestionnaire,
    setIsEndOfQuestionnaire
  ] = useState<boolean>(false)
  const [ fontSize, setFontSize ] = useState<string>('13px')
  const [ userResponses, setUserResponses] = useState<any>({})
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ hasSubmitted, setHasSubmitted ] = useState(false)
  const [ isVertical, setIsVertical ] = useState<boolean>(false)
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0)


  const questions = BIG_FIVE_ACTIVITY_BANK[
    activityBankId
  ]

  const FRAGMENT_KEY_PREFACE = BIG_FIVE_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )


  // onChange event handler
  const onChange = (e: any, questionIndex: number) => {
    const { name, value } = e.target
    setUserResponses({ ...userResponses, [`${name}`]: value })

    // Move to the next question after a short delay
    if (questionIndex < questions.length - 1) {
      const timeout = 28 // 300ms delay for the transition effect

      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1)
      }, timeout)
    }
  }

  // Get `Fragment` key
  const getActivityFragmentKey = (
    i: number
  ) => `${FRAGMENT_KEY_PREFACE}--question-item-${i}`


  // Function to update question body vertical option size based on window width
  const updateQuestionBodyDisplay = () => {
    const width = window.innerWidth
    const innerWidth = 780
    setIsVertical(width < innerWidth ? true : false)
  }


  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()
    
    setIsSubmitting(true)
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



  // Update font size on component mount and window resize
  useLayoutEffect(() => {
    updateQuestionBodyDisplay()
    window.addEventListener('resize', updateQuestionBodyDisplay)

    return () => {
      window.removeEventListener('resize', updateQuestionBodyDisplay)
    }
  }, [])


  // Test that data is being stored
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponses: `, userResponses)
  }, [userResponses])




  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >
        <p>{ questionText }</p>

        <div style={ { margin: '48px 0px 48px 0px' } }>
          <Questionnaire
            onChange={ onChange }
            questions={ questions }
            currentQuestionIndex={ currentQuestionIndex }
            setIsEndOfQuestionnaire={ setIsEndOfQuestionnaire }
            choices={ BIG_FIVE_ACTIVITY_BANK_LEGEND[activityBankId] }
          />
          { isEndOfQuestionnaire && (
            <>
              <FormButton
                buttonText={ buttonText }
                state={ {
                  isSubmitting: isSubmitting,
                  hasSubmitted: hasSubmitted,
                } }
              />
            </>
          )}
        </div>

      </form>
    </>
  )
}


export default GeneralActivities