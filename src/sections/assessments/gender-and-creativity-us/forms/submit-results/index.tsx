// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import {
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/task-enjoyment`

const BUTTON_TEXT = `See your results!`
const QUESTION_TEXT = `Do you have any comments or feedback to provide to us?`



type SubmitResultsFormProps = {
  pageFragmentId: string
}



const SubmitResultsForm: FC<SubmitResultsFormProps> = ({
  pageFragmentId
}) => {
  // hooks
  const router = useRouter()

  const [ userResponses, setUserResponses ] = useState<any>({})
  const [ commentsOrFeedback, setCommentsOrFeedback ] = useState<any>({})



  const FRAGMENT_KEY_PREFACE = GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )



  function onCommentsOrFeedbackChange(e: any) {
    setCommentsOrFeedback(e.target.value)
  }


  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    setUserResponses(commentsOrFeedback)

    await storeResponsesInLocalStorage(userResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)
  }


  // Test that data is being stored
  useLayoutEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponses: `, userResponses)
  }, [userResponses])





  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <div>
          <p>
            { QUESTION_TEXT }
          </p>
        </div>

        <div>
          <TextOrNumberInput
            controls={{ type: 'text' }}
            name={ 'comments-or-feedback' }
            onChange={ (e: any) => onCommentsOrFeedbackChange(e) }
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          />
        </div>

        <div style={ { float: 'right' } }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { BUTTON_TEXT }
          </button>
        </div>

      </form>
    </>
  )
}


export default SubmitResultsForm