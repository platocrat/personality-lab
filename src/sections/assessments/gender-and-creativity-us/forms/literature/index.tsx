'use client'

// Externals
import { FC, Fragment } from 'react'
import { useRouter } from 'next/navigation'
// Locals
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${ GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF }/creative-activities-and-achievements/music`

const BUTTON_TEXT = `Next`
const PAGE_TITLE = `Literature`
const PAGE_FRAGMENT_ID = `literature`



type LiteratureFormProps = {}



const LiteratureForm: FC<LiteratureFormProps> = ({ }) => {
  const router = useRouter()


  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    // await storeResponsesInDynamoDB(spendTimeWithOthersResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  /**
   * @todo INCOMPLETE
   */
  async function storeResponsesInDynamoDB(
    spendTimeWithOthersResponses
  ) {
    const CURRENT_TIMESTAMP = new Date().getTime()

    /**
     * @todo Generalize this function call so that it can be called from 
     * anywhere and NOT just from the `/bessi/assessment/api/aws-parameter`
     */
    const email = await getUserEmailFromCookie()

    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      /**
       * @dev This is the object that we store in DynamoDB using AWS's 
       * `PutItemCommand` operation.
       */
      const userResults: GenderAndCreativityUs__SpendTimeWithOthersResults__DynamoDB = {
        email: email,
        timestamp: CURRENT_TIMESTAMP,
        spendTimeWithOthersResponses: spendTimeWithOthersResponses,
      }

      try {
        const response = await fetch('/bessi/assessment/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ spendTimeWithOthersResponses }),
        })

        const json = await response.json()

        if (response.status === 200) {
          const userResultsId = json.data
          return userResultsId
        } else {
          const error = `Error posting BESSI results to DynamoDB: `
          /**
           * @todo Handle error UI here
           */
          throw new Error(error, json.error)
        }
      } catch (error: any) {
        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error! `, error)

      }
    }
  }




  return (
    <>
      <CreativityAndAchievementsForm
        href={ href }
        pageTitle={ PAGE_TITLE }
        activityBankId={ 'literature' }
        pageFragmentId={ PAGE_FRAGMENT_ID }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      />
    </>
  )
}


export default LiteratureForm