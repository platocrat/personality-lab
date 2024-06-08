'use client'

// Externals
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, Fragment, useContext, useLayoutEffect, useState } from 'react'
// Locals
import BessiAssessmentInstructions from './instructions'
import BessiDemographicQuestionnaire from '../demographic-questionnaire'
// Components
import FormButton from '@/components/Buttons/Form'
import Spinner from '@/components/Suspense/Spinner'
import Questionnaire from '@/components/Questionnaire'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { UserDemographicsContext } from '@/contexts/UserDemographicsContext'
// Context types 
// Utilities
import {
  getFacet,
  UserScoresType,
  getAccessToken,
  FacetFactorType,
  bessiActivityBank,
  RESULTS__DYNAMODB,
  calculateBessiScores,
  SkillDomainFactorType,
  STUDY_SIMPLE__DYNAMODB,
  getSkillDomainAndWeight,
  wellnessRatingDescriptions,
  BessiUserResults__DynamoDB,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type BessiProps = {}



const TITLE = `BESSI`
const BUTTON_TEXT = `Submit`
const ASSESSMENT_ID = 'bessi'



const BessiAssessment: FC<BessiProps> = ({ }) => {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const router = useRouter()
  // Contexts
  const { setBessiSkillScores } = useContext(BessiSkillScoresContext)
  const { 
    // State variables
    age,
    gender,
    usState,
    zipCode,
    isParent,
    socialClass,
    foreignCountry,
    raceOrEthnicity,
    priorCompletion,
    isFluentInEnglish,
    currentMaritalStatus,
    highestFormalEducation,
    currentEmploymentStatus,
    // Form input handlers
   } = useContext(UserDemographicsContext)  

  // Custom
  const [
    userScores,
    setUserScores
  ] = useState<{ [key: string]: UserScoresType } | null>(null)
  // Booleans
  const [ 
    isEndOfQuestionnaire, 
    setIsEndOfQuestionnaire 
  ] = useState<boolean>(false)
  const [ isLoadingResults, setIsLoadingResults ] = useState<boolean>(false)
  // Numbers
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState<number>(0)


  const questions = bessiActivityBank.map(
    bessiActivity => bessiActivity.activity
  )


  //------------------------- Regular function handlers ----------------------
  function getCurrentStudy(): STUDY_SIMPLE__DYNAMODB {
    const key = 'currentStudy'
    const localStorageItem = localStorage.getItem(key) ?? ''
    const currentStudy = JSON.parse(localStorageItem) as STUDY_SIMPLE__DYNAMODB
    return currentStudy
  }


  function resetCurrentStudy() {
    const key = 'currentStudy'
    localStorage.removeItem(key)
  }


  function onWellnessRatingChange(e: any, questionIndex: number) {
    const { value } = e.target

    // Use `questionIndex + 1` because `bessiActivityBank` has no value for 0.
    const activityIndex = questionIndex + 1

    const _userScore: UserScoresType = {
      facet: getFacet(activityIndex),
      ...getSkillDomainAndWeight(getFacet(activityIndex)),
      response: parseInt(value)
    }

    setUserScores({
      ...userScores,
      [ `${ activityIndex }` ]: _userScore
    })

    // Move to the next question after a short delay
    if (questionIndex < questions.length - 1) {
      const timeout = 28 // 300ms delay for the transition effect

      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1)
      }, timeout)
    }
  }


  // --------------------------- Async functions -------------------------------
  async function handleSubmit(e: any): Promise<void> {
    if (userScores) {
      e.preventDefault()

      // 1. Trigger suspense
      setIsLoadingResults(true)
      
      // console.log(`userScores: `, userScores)

      // 2. Calculate domain and facet scores
      const finalScores: {
        id?: string,
        accessToken?: string
        facetScores: FacetFactorType
        domainScores: SkillDomainFactorType
      } = calculateBessiScores(Object.values(userScores))

      // console.log('finalScores: ', finalScores)

      // 3. Store `userResults` in DynamoDB and generate its respective ID
      await storeResultsInDynamoDB(finalScores)
    }
  }


  async function storeResultsInDynamoDB(
    finalScores: {
      id?: string,
      accessToken?: string
      studyId?: string
      facetScores: FacetFactorType
      domainScores: SkillDomainFactorType
    },
  ) {
    const DEMOGRAPHICS: BessiUserDemographics__DynamoDB = {
      age: age,
      gender: gender,
      usState: usState,
      zipCode: zipCode,
      isParent: isParent,
      socialClass: socialClass,
      foreignCountry: foreignCountry,
      priorCompletion: priorCompletion,
      raceOrEthnicity: raceOrEthnicity,
      englishFluency: isFluentInEnglish,
      currentMaritalStatus: currentMaritalStatus,
      highestFormalEducation: highestFormalEducation,
      currentEmploymentStatus: currentEmploymentStatus,
    }

    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    const bessiUserResults: BessiUserResults__DynamoDB = {
      facetScores: finalScores.facetScores,
      domainScores: finalScores.domainScores,
      demographics: DEMOGRAPHICS,
    }
    
    const study = getCurrentStudy()

    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    const userResults: Omit<RESULTS__DYNAMODB, "id"> = {
      email: user?.email ?? '',
      study,
      timestamp: 0,
      results: bessiUserResults
    }

    try {
      const response = await fetch('/api/assessment/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userResults }),
      })

      const json = await response.json()

      if (response.status === 200 ) {
        const userResultsId = json.userResultsId

        // 4. Use ID of `userResults` to generate access token
        const accessToken = await getAccessToken(
          ASSESSMENT_ID,
          userResultsId,
          study.id
        )

        // 5. Create new object with final scores and access token to cache 
        //    on the client so that we can use the access token to share the 
        //    user's results to others.
        finalScores= {
          ...finalScores,
          id: userResultsId,
          accessToken: accessToken,
          studyId: study.id,
        }

        // 5. Store final scores in React state
        setBessiSkillScores(finalScores)
        // 6.  Navigate to the results page
        const href = `/${ASSESSMENT_ID}/assessment/results`

        /**
         * @dev Refactor `sendEmail()` function to use SendGrid instead of
         * Postmark. Reach out to Dr. Roberts to get the API key necessary for
         * this.
         */
        // // 7. Send the users results to their account email address
        // await sendEmail()

        // 8. Use router to route the user the results page
        router.push(href)
        
        // 9. Reset current study
        resetCurrentStudy()
      } else {
        setIsLoadingResults(false)
        
        const error = `Error posting ${ 
          ASSESSMENT_ID.toUpperCase() 
        } results to DynamoDB: `
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setIsLoadingResults(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)

    }
  }


  useLayoutEffect(() => {
    if (!isLoading && user && user.email) {
      // Do nothing if Auth0 found the user's email
    } else if (!isLoading && !user) {
      // Silently log the error to the browser's console
      console.error(
        `Auth0 couldn't get 'user' from useUser(): `,
        error
      )
    }
  }, [isLoading])




  return (
    <Fragment key={ `bessi-assessment` }>
      <div className={ styles.assessmentWrapper }>
        <form
          className={ styles.grayColor }
          onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
        >
          <h2 
            className={ styles.assessmentTitle }
            style={{ textAlign: isLoadingResults ? 'center' : 'left' }}
          >
              { TITLE }
          </h2>

          { isLoadingResults ? (
            <>
              <div
                style={ {
                  ...definitelyCenteredStyle,
                  position: 'relative',
                  flexDirection: 'column',
                } }
              >
                <div style={ { marginBottom: '24px' } }>
                  <p>{ `Loading results...` }</p>
                </div>
                <Spinner height='40' width='40' />
              </div>
            </>
          ) : (
            <>
              <BessiAssessmentInstructions />

              <Questionnaire
                questions={ questions }
                controls={{ valueType: 'number' }}
                onChange={ onWellnessRatingChange }
                choices={ wellnessRatingDescriptions }
                currentQuestionIndex={ currentQuestionIndex }
                setIsEndOfQuestionnaire={ setIsEndOfQuestionnaire }
              />

              { isEndOfQuestionnaire && (
                <>
                  <BessiDemographicQuestionnaire />
                  <FormButton 
                    buttonText={ BUTTON_TEXT }
                    state={{
                      isSubmitting: isLoadingResults,
                      hasSubmitted: isLoadingResults,
                    }}
                  />
                </>
              ) }
            </>
          ) }
        </form>
      </div>
    </Fragment>
  )
}

export default BessiAssessment