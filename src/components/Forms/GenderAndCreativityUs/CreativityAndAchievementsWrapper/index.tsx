'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
// Locals
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import { 
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF, 
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES,
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


  const FRAGMENT_KEY_PREFACE = GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )



  const onActivityChange = (e: any): void => {
    const { name, value } = e.target
    setActivityResponses({ ...activityResponses, [`${ name }`]: value })
  }


  const onEngagementLevelChange = (e: any): void => {
    const { name, value } = e.target

    setEngagementLevelResponses({
      ...engagementLevelResponses,
      [`${ name }`]: value
    })
  }


  const onYearsEngagedInChange = (e: any): void => setYearsEngagedIn(
    e.target.value
  )



  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    const userResponses = {
      yearsEngagedIn,
      activityResponses,
      engagementLevelResponses,
    }

    setUserResponses(userResponses)

    await storeResponsesInLocalStorage(userResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)
  }

  // /**
  //  * @todo INCOMPLETE
  //  */
  // async function storeResponsesInDynamoDB(
  //   userResponses
  // ) {
  //   const CURRENT_TIMESTAMP = new Date().getTime()

  //   /**
  //    * @todo Generalize this function call so that it can be called from 
  //    * anywhere and NOT just from the `/bessi/assessment/api/aws-parameter`
  //    */
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
  //     const userResults: GenderAndCreativityUs__UserResponses__DynamoDB = {
  //       email: email,
  //       timestamp: CURRENT_TIMESTAMP,
  //       userResponses: userResponses,
  //     }

  //     try {
  //       const response = await fetch('/bessi/assessment/api/results', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userResponses }),
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


  // Test outputs from onChange event handlers
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponse: `, userResponses)
  }, [userResponses])





  return (
    <>
      <CreativityAndAchievementsForm
        href={ href }
        pageTitle={ pageTitle }
        onSubmit={ handleOnSubmit }
        activityBankId={ activityBankId }
        pageFragmentId={ pageFragmentId }
        onChange={ {
          onActivityChange: onActivityChange,
          onYearsEngagedInChange: onYearsEngagedInChange,
          onEngagementLevelChange: onEngagementLevelChange
        } }
      />
    </>
  )
}


export default CreativityAndAchievementsFormWrapper