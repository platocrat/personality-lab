'use client'

// Externals
import { useRouter } from 'next/navigation'
// import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, Fragment, useContext, useLayoutEffect, useState } from 'react'
// Locals
import BessiAssessmentInstructions from '@/sections/assessments/bessi/assessment/instructions'
import BessiDemographicQuestionnaire from '@/sections/assessments/bessi/demographic-questionnaire'
// Components
import FormButton from '@/components/Buttons/Form'
import Questionnaire from '@/components/Questionnaire'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { UserDemographicsContext } from '@/contexts/UserDemographicsContext'
// Context Type
import {
  SessionContextType,
  GameSessionContextType,
  BessiSkillScoresContextType,
} from '@/contexts/types'
// Utilities
import {
  Facet,
  getFacet,
  getDomain,
  SkillDomain,
  UserScoresType,
  getAccessToken,
  FacetFactorType,
  RESULTS__DYNAMODB,
  BessiActivityType,
  calculateBessiScores,
  SkillDomainFactorType,
  STUDY_SIMPLE__DYNAMODB,
  getSkillDomainAndWeight,
  generateBessiActivityBank,
  BessiUserResults__DynamoDB,
  WELLNESS_RATINGS_DESCRIPTIONS,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



type BessiProps = {
  bessiVersion: number
  reportType: 'self-report' | 'observer-report'
  onCompletion?: () => Promise<void>
}



const TITLE = `BESSI`
const BUTTON_TEXT = `Submit`
const ASSESSMENT_ID = 'bessi'



const BessiAssessmentSection: FC<BessiProps> = ({
  reportType,
  onCompletion,
  bessiVersion,
}) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()

  // ------------------------------ Contexts -----------------------------------
  const { 
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
  } = useContext(UserDemographicsContext)  
  const { 
    isGameInSession 
  } = useContext<GameSessionContextType>(GameSessionContext)
  const { 
    setBessiSkillScores 
  } = useContext<BessiSkillScoresContextType>(BessiSkillScoresContext)
  const { email } = useContext<SessionContextType>(SessionContext)
  // --------------------------------- Hooks -----------------------------------
  const router = useRouter()
  // -------------------------------- States -----------------------------------
  // Custom
  const [
    userScoresMapping,
    setUserScoresMapping
  ] = useState<{ [key: string]: UserScoresType } | null>(null)
  // Strings
  const [ questions, setQuestions ] = useState<string[]>([''])
  // Booleans
  const [ 
    isEndOfQuestionnaire, 
    setIsEndOfQuestionnaire 
  ] = useState<boolean>(false)
  const [ isLoadingResults, setIsLoadingResults ] = useState<boolean>(false)
  // Numbers
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState<number>(0)


  //--------------------------- Regular functions ------------------------------
  function getCurrentStudy(): { 
    isNonStudy: boolean, 
    study: STUDY_SIMPLE__DYNAMODB | undefined 
  } {
    const key = 'currentStudy'
    const localStorageItem = localStorage.getItem(key) ?? ''

    if (localStorageItem === '') {
      return {
        isNonStudy: false,
        study: undefined,
      }
    } else {
      const currentStudy = JSON.parse(localStorageItem) as STUDY_SIMPLE__DYNAMODB
      return  {
        isNonStudy: false,
        study: currentStudy,
      }
    }
  }


  function resetCurrentStudy() {
    const key = 'currentStudy'
    localStorage.removeItem(key)
  }


  function onWellnessRatingChange(e: any, questionIndex: number) {
    const { value } = e.target

    // Use `questionIndex + 1` because the activity bank starts at 1
    const activityIndex = questionIndex + 1

    let _userScore: UserScoresType = {
      facet: Facet.Adaptability,
      domain: [ SkillDomain.SelfManagement ],
      weight: 0,
      response: 0,
    }

    if (bessiVersion === 192 || bessiVersion === 96) {
      const facet = getFacet(activityIndex)
      const { domain, weight } = getSkillDomainAndWeight(facet)
      
      _userScore = {
        facet,
        domain,
        weight,
        response: parseInt(value)
      }
    } else if (bessiVersion === 45 || bessiVersion === 20) {
      const domain = getDomain(activityIndex, bessiVersion)
      
      _userScore = {
        domain,
        response: parseInt(value)
      }
    }

    setUserScoresMapping({
      ...userScoresMapping,
      [ `${ activityIndex }` ]: _userScore
    })

    // Move to the next question after a short delay
    if (questionIndex < questions.length - 1) {
      const timeout = 28 // 28ms delay for the transition effect

      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1)
      }, timeout)
    }
  }



  // --------------------------- Async functions -------------------------------
  /**
   * @dev Handles whether to redirect to the next game phase or to the results
   *      page. 
   */
  async function afterResultsSubmissions(): Promise<void> {
    if (isGameInSession && onCompletion) {
      await onCompletion() // Continues
    } else {
      await redirectToResultsPage()
    }
  }


  // ~~~~~~ Submits BESSI results to appropriate DynamoDB table ~~~~~~
  async function onSubmit(
    e: any
  ): Promise<void> {
    if (userScoresMapping) {
      e.preventDefault()

      // 1. Trigger suspense
      setIsLoadingResults(true)
      
      // console.log(`userScores: `, userScores)

      const userScores = Object.values(userScoresMapping)
      
      type FinalScores = {
        id?: string,
        accessToken?: string
        facetScores?: FacetFactorType
        domainScores: SkillDomainFactorType
      }

      // 2. Calculate domain and facet scores
      const finalScores: FinalScores = calculateBessiScores(
        userScores, 
        bessiVersion
      )

      // console.log('finalScores: ', finalScores)

      // 3. Store `userResults` in DynamoDB and generate its respective ID
      await storeResultsInDynamoDB(finalScores)
    }
  }


  /**
   * @dev Redirects the user to the results page to view their assessment 
   *      results and a data an appropriate visualization.
   */
  async function redirectToResultsPage(): Promise<void> {
    // Navigate to the results page
    const href = `/${ASSESSMENT_ID}/assessment/results`
    
    /**
     * @dev Refactor `sendEmail()` function to use SendGrid instead of
     * Postmark. Reach out to Dr. Roberts to get the API key necessary for
     * this.
    */
    // Send the users results to their account email address
    // await sendEmail()
    
    // Use router to route the user the results page
    router.push(href)
    
    // Reset current study
    resetCurrentStudy()
  }


  /**
   * @dev Submits BESSI results to the appropriate DynamoDB tables
   * @param finalScores
   */
  async function storeResultsInDynamoDB(
    finalScores: {
      id?: string,
      accessToken?: string
      studyId?: string
      facetScores?: FacetFactorType
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
    const bessiUserResults: BessiUserResults__DynamoDB = finalScores.facetScores 
      ? {
          facetScores: finalScores.facetScores,
          domainScores: finalScores.domainScores,
          demographics: DEMOGRAPHICS,
        }
      : {
          domainScores: finalScores.domainScores,
          demographics: DEMOGRAPHICS,
        }
    
    const { study, isNonStudy } = getCurrentStudy()

    let userResults: Omit<RESULTS__DYNAMODB, "id">

    /**
     * @dev This is the object that we store in DynamoDB using AWS's 
     * `PutItemCommand` operation.
     */
    if (isNonStudy) {
      userResults = {
        email: email ?? '',
        timestamp: 0,
        results: bessiUserResults
      }
    } else {
      userResults = {
        email: email ?? '',
        study,
        timestamp: 0,
        results: bessiUserResults
      }
    }


    try {
      const response = await fetch('/api/v1/assessment/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userResults,
        }),
      })

      const json = await response.json()

      if (response.status === 200 ) {
        const userResultsId = json.userResultsId

        // 4. Use ID of `userResults` to generate access token
        const accessToken = await getAccessToken(
          ASSESSMENT_ID,
          userResultsId,
          email,
          study?.id
        )

        // 5. Create new object with final scores and access token to cache 
        //    on the client so that we can use the access token to share the 
        //    user's results to others.
        finalScores = {
          ...finalScores,
          id: userResultsId,
          accessToken: accessToken,
          studyId: study?.id,
        }

        // 5. Store final scores in React state
        setBessiSkillScores(finalScores)
        
        // 6. Handle what happens after assessment results are stored in 
        //    DynamoDB.
        await afterResultsSubmissions()
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


  // -------------------------- `useLayoutEffect`s -----------------------------
  useLayoutEffect(() => {
    const activityBank = generateBessiActivityBank(reportType, bessiVersion)
    const questions_ = activityBank.map(
      (bessiActivity: BessiActivityType): string => bessiActivity.activity
    )

    setQuestions(questions_)
  }, [ reportType, bessiVersion ])


  useLayoutEffect(() => {
    // if (!isLoading && user && user.email) {
    if (email) {
      // Do nothing if Auth0 found the user's email
    // } else if (!isLoading && !user) {
    } else {
      // // Silently log the error to the browser's console
      // console.error(
      //   `Auth0 couldn't get 'user' from useUser(): `,
      //   error
      // )

      console.error(`Couldn't get the user's email`)
    }
  }, [ /* isLoading */ email ])





  return (
    <Fragment key={ `bessi-assessment` }>
      <div className={ styles.assessmentWrapper }>
        <form
          className={ styles.grayColor }
          onSubmit={ (e: any): Promise<void> => onSubmit(e) }
        >
          <h2 
            className={ styles.assessmentTitle }
            style={{ textAlign: isLoadingResults ? 'center' : 'left' }}
          >
              { TITLE }
          </h2>

          <NetworkRequestSuspense
            isLoading={ isLoadingResults }
            spinnerOptions={{
              showSpinner: true,
              isAssessmentResults: true,
              containerStyle: {
                flexDirection: 'column',
                top: '4px'
              }
            }}
          >
            <BessiAssessmentInstructions />

            <Questionnaire
              questions={ questions }
              controls={ { valueType: 'number' } }
              onChange={ onWellnessRatingChange }
              choices={ WELLNESS_RATINGS_DESCRIPTIONS }
              currentQuestionIndex={ currentQuestionIndex }
              setIsEndOfQuestionnaire={ setIsEndOfQuestionnaire }
            />

            { isEndOfQuestionnaire && (
              <>
                <BessiDemographicQuestionnaire />
                <FormButton
                  buttonText={ BUTTON_TEXT }
                  state={ {
                    isSubmitting: isLoadingResults,
                    hasSubmitted: isLoadingResults,
                  } }
                />
              </>
            ) }
          </NetworkRequestSuspense>
        </form>
      </div>
    </Fragment>
  )
}

export default BessiAssessmentSection