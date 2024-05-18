'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useEffect, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
// Utils
import {
  getItemsFromLocalStorage,
  GENDER_AND_CREATIVITY_US_FORM_IDS,
  BIG_FIVE_ASSESSMENT_HREF,
  BIG_FIVE_FRAGMENT_ID_PREFACES,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/results`

const BUTTON_TEXT = `See your results!`
const QUESTION_TEXT = `Do you have any comments or feedback to provide to us?`



type SubmitResultsFormProps = {
  pageFragmentId: string
}



const SubmitResultsForm: FC<SubmitResultsFormProps> = ({
  pageFragmentId
}) => {
  // Hooks
  const router = useRouter()
  // State
  const [ userResults, setUserResults ] = useState<any>({})
  const [ commentsOrFeedback, setCommentsOrFeedback ] = useState<any>({})


  const FRAGMENT_KEY_PREFACE = BIG_FIVE_FRAGMENT_ID_PREFACES(
    'main'
  )


  function onCommentsOrFeedbackChange(e: any) {
    const { value } = e.target
    setCommentsOrFeedback(value)
  }


  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    const userResults = getItemsFromLocalStorage(
      GENDER_AND_CREATIVITY_US_FORM_IDS
    )

    setUserResults(userResults)

    // await storeResultsInDynamoDB(userResults)

    // Use router to route the user to the results page
    router.push(href)
  }


  // /**
  //  * @todo INCOMPLETE
  //  */
  // async function storeResultsInDynamoDB(
  //   _userResults
  // ) {
  //   const CURRENT_TIMESTAMP = new Date().getTime()

  //   const email = await getUserEmailFromCookie()

  //   if (email === undefined) {
  //     /**
  //      * @todo Replace the line below by handling the error on the UI here
  //      */
  //     throw new Error(`Error getting email from cookie!`)
  //   } else {
  //     /**
  //      * @dev This is the object that we store in DynamoDB using AWS's
  //      * `PutItemCommand` operation.
  //      */
  //     const userResults_: BigFive__UserResults__DynamoDB = {
  //       email: email,
  //       timestamp: CURRENT_TIMESTAMP,
  //       userResults: _userResults,
  //     }

  //     try {
  //       const response = await fetch('/api/assessment/results', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userResults_ }),
  //       })

  //       const json = await response.json()

  //       if (response.status === 200) {
  //         const userResultsId = json.data
  //         return userResultsId
  //       } else {
  //         const error = `Error posting BESSI results to DynamoDB: `
  //         /**
  //          * @todo Handle error UI here
  //          */
  //         throw new Error(error, json.error)
  //       }
  //     } catch (error: any) {
  //       /**
  //        * @todo Handle error UI here
  //        */
  //       throw new Error(`Error! `, error)

  //     }
  //   }
  // }


  // Test that data is being stored
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResults: `, userResults)
  }, [userResults])





  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <div style={{ margin: '36px 0px' }}>
          <div>
            <p>
              { QUESTION_TEXT }
            </p>
          </div>

          <div 
            style={{
              ...definitelyCenteredStyle,
              margin: '24px 0px'
            }}
          >
            <TextOrNumberInput
              controls={{ type: 'text' }}
              name={ 'comments-or-feedback' }
              style={{
                width: '425px',
                height: '36px',
              }}
              onChange={ (e: any) => onCommentsOrFeedbackChange(e) }
            />
          </div>
        </div>

        <div style={ definitelyCenteredStyle }>
          <button className={ styles.button }  style={ { width: '134px' } }>
            { BUTTON_TEXT }
          </button>
        </div>

      </form>
    </>
  )
}


export default SubmitResultsForm