// Externals
import Link from 'next/link'
import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/navigation'
import { FC, Fragment, useContext, useEffect, useState } from 'react'
// Locals
import BessiQuestionnaire from './questionnaire'
import BessiAssessmentInstructions from './instructions'
import BessiDemographicQuestionnaire from '../demographic-questionnaire'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import Questionnaire from '@/components/Questionnaire'
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utilities
import { 
  Gender, 
  YesOrNo,
  USState,
  getFacet,
  SocialClass, 
  LibsodiumUtils,
  UserScoresType,
  wellnessRatings,
  bessiActivityBank,
  FacetFactorType,
  RaceOrEthnicity, 
  AWS_PARAMETER_NAMES, 
  CurrentMaritalStatus, 
  calculateBessiScores,
  SkillDomainFactorType,
  HighestFormalEducation, 
  getSkillDomainAndWeight,
  CurrentEmploymentStatus,
  BessiUserResults__DynamoDB,
  wellnessRatingDescriptions,
  BessiUserDemographics__DynamoDB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type BessiProps = {}



const TITLE = `BESSI`
const BUTTON_TEXT = `Submit`



const SubmitButton = () => {
  return (
    <>
      <div style={{ float: 'right' }}>
        <button className={ styles.button } style={ { width: '75px' } }>
          { BUTTON_TEXT }
        </button>
      </div>
    </>
  )
}




const BessiAssessment: FC<BessiProps> = ({ }) => {
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
   } = useContext(UserDemographicContext)  

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
  function onWellnessRatingChange(e: any, questionIndex: number) {
    const { value } = e.target

    // Use `itemIndex + 1` because `bessiActivityBank` has no value for 0.
    const _itemIndex = value + 1

    const _userScore: UserScoresType = {
      facet: getFacet(_itemIndex),
      ...getSkillDomainAndWeight(getFacet(_itemIndex)),
      response: e.target.value
    }

    setUserScores({
      ...userScores,
      [`${_itemIndex}`]: _userScore
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
      
      console.log(`userScores: `, userScores)

      // 2. Calculate domain and facet scores
      let finalScores: {
        id?: string,
        accessToken?: string
        facetScores: FacetFactorType
        domainScores: SkillDomainFactorType
      } = calculateBessiScores(Object.values(userScores))

      console.log('finalScores: ', finalScores)

      // 3. Store `userResults` in DynamoDB and generate its respective ID
      const userResultsId = await storeResultsInDynamoDB(finalScores)
      // 4. Use ID of `userResults` to generate access token
      const accessToken = await getAccessToken(userResultsId)

      // 4. Create new object with final scores and access token to cache on 
      //    the client so that we can use the access token to share the user's
      //    results to others.
      finalScores = { 
        ...finalScores, 
        id: userResultsId,
        accessToken: accessToken
      }

      // 5. Store final scores in React state
      setBessiSkillScores(finalScores)
      
      // 6.  Navigate to the results page
      const href = '/bessi/assessment/results'
      
      // 7. End suspense
      setIsLoadingResults(false)
      
      // 8. Use router to route the user the results page
      router.push(href)
      
      /**
       * @dev Refactor `sendEmail()` function to use SendGrid instead of
       * Postmark. Reach out to Dr. Roberts to get the API key necessary for
       * this.
       */
      // // 9. Send the users results to their account email address
      // await sendEmail()
    }
  }


  async function storeResultsInDynamoDB(
    finalScores: {
      facetScores: FacetFactorType,
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

    const CURRENT_TIMESTAMP = new Date().getTime()
    
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
      const userResults: Omit<BessiUserResults__DynamoDB, "id">  = {
        email: email,
        timestamp: CURRENT_TIMESTAMP,
        facetScores: finalScores.facetScores,
        domainScores: finalScores.domainScores,
        demographics: DEMOGRAPHICS,
      }

      try {
        const response = await fetch('/bessi/assessment/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userResults }),
        })

        const json = await response.json()

        if (response.status === 200 ) {
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


  async function getAccessToken(userResultsId: string) {
    if (!userResultsId) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(
        `Error: 'userResultsId' is invalid, see 'userResultsId': ${ 
          userResultsId 
        }!`
      )
    } else {
      try {
        const response = await fetch('/bessi/assessment/api/access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userResultsId: userResultsId }),
        })

        const json = await response.json()

        if (response.status === 200) {
          const accessToken = json.data
          return accessToken
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


  /**
   * @dev Note that the password that is returned is a hashed password
   */
  async function getUserEmailFromCookie() {
    type CookieType = { email: string,  username: string, password: string }
    
    try {
      const response = await fetch('/bessi/assessment/api/aws-parameter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          parameterName: AWS_PARAMETER_NAMES.JWT_SECRET
         }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const JWT_SECRET: string = data.secret
        const cookies = document.cookie        
        const token = cookies.split('=')[0]
        
        // Cannot use `verify()` because it is only used server-side
        const decoded = decode(token)
        const encryptedEmail = (decoded as CookieType).email

        const SECRET_KEY = await getCookieSecretKey(encryptedEmail)
        const email = await LibsodiumUtils.decryptData(encryptedEmail, SECRET_KEY)

        return email
      } else {
        throw new Error(
          `Error getting ${AWS_PARAMETER_NAMES.JWT_SECRET }: ${ data.error }`
        )
        /**
         * @todo Handle error UI here
         */
      }
    } catch (error: any) {
      throw new Error(
        `Error fetching ${ AWS_PARAMETER_NAMES.JWT_SECRET } from API route! ${ error }`
      )
      /**
       * @todo Handle error UI here
       */
    }
  }


  async function getCookieSecretKey(encryptedEmail: string) {
    try {
      const response = await fetch('/bessi/assessment/api/aws-parameter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameterName: AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const SECRET_KEY: string = data.secret
        return LibsodiumUtils.base64ToUint8Array(SECRET_KEY)
      } else {
        throw new Error(
          `Error getting ${AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY}: ${data.error}`
        )
        /**
         * @todo Handle error UI here
         */
      }
    } catch (error: any) {
      throw new Error(
        `Error fetching ${AWS_PARAMETER_NAMES.COOKIE_ENCRYPTION_SECRET_KEY} from API route! ${error}`
      )
      /**
       * @todo Handle error UI here
       */
    }
  }
  

  async function sendEmail() {
    const email = await getUserEmailFromCookie()

    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      // Send email
      try {
        const response = await fetch('/bessi/assessment/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        if (response.status === 200) {
          console.log(`data: `, data)
        } else {
          throw new Error(`Error getting JWT secret: ${data.error}`,)
          /**
           * @todo Handle error UI here
           */
        }
      } catch (error: any) {
        throw new Error(`Error! ${error}`)
        /**
         * @todo Handle error UI here
         */
      }
    }
  }



  return (
    <Fragment key={ `bessi-assessment` }>
      <div className={ styles.assessmentWrapper }>
        <form
          className={ styles.grayColor }
          onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
        >
          <h2 className={ styles.assessmentTitle }>{ TITLE }</h2>
          
          <BessiAssessmentInstructions />

          <Questionnaire
            questions={ questions }
            onChange={ onWellnessRatingChange }
            choices={ wellnessRatingDescriptions }
            currentQuestionIndex={ currentQuestionIndex }
            setIsEndOfQuestionnaire={ setIsEndOfQuestionnaire }
          /> 
      
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
              { isEndOfQuestionnaire && (
                <>
                  <BessiDemographicQuestionnaire />
                  <SubmitButton />
                </>
              )}
            </>
          ) }
        </form>
      </div>
    </Fragment>
  )
}

export default BessiAssessment