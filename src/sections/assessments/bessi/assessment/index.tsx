// Externals
import Link from 'next/link'
import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/navigation'
import { FC, Fragment, useContext, useEffect, useState } from 'react'
// Locals
import BessiQuestionnaire from './questionnaire'
import BessiAssessmentInstructions from './instructions'
import BessiDemographicQuestionnaire from '../demographic-questionnaire'
// Contexts
import { UserScoresContext } from '@/contexts/UserScoresContext'
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utility functions
import { calculateBessiScores } from '@/utils'
// Types
import { 
  UserScoresType,
  FacetFactorType,
  SkillDomainFactorType,
  BessiUserResults__DynamoDB,
} from '@/utils/bessi/types'
// Enums
import { 
  Gender, 
  YesOrNo,
  USState,
  SocialClass, 
  RaceOrEthnicity, 
  CurrentMaritalStatus, 
  HighestFormalEducation, 
  CurrentEmploymentStatus,
} from '@/utils/bessi/types/enums'
// CSS
import styles from '@/app/page.module.css'



type BessiProps = {}


const BessiAssessment: FC<BessiProps> = ({ }) => {
  // Hooks
  const router = useRouter()
  // Contexts
  const { setBessiSkillScores } = useContext(BessiSkillScoresContext)

  // Custom
  const [
    userScores,
    setUserScores
  ] = useState<{ [key: string]: UserScoresType } | null>(null)
  // Numbers
  const [ age, setAge ] = useState<number>(0)
  // Regular strings
  const [ zipCode, setZipCode ] = useState<string>('')
  const [ foreignCountry, setForeignCountry ] = useState<string>('')
  // Enums
  const [
    isFluentInEnglish,
    setIsFluentInEnglish
  ] = useState<YesOrNo>(YesOrNo.No)
  const [
    highestFormalEducation,
    setHighestFormalEducation
  ] = useState<HighestFormalEducation>(
    HighestFormalEducation.HaveNotCompletedHighSchool
  )
  const [
    socialClass,
    setSocialClass
  ] = useState<SocialClass>(SocialClass.LowerMiddleClass)
  const [ 
    raceOrEthnicity, 
    setRaceOrEthnicity 
  ] = useState<RaceOrEthnicity>(RaceOrEthnicity.WhiteCaucasian)
  const [
    currentMaritalStatus,
    setCurrentMaritalStatus
  ] = useState<CurrentMaritalStatus>(CurrentMaritalStatus.NeverMarried)
  const [
    currentEmploymentStatus,
    setCurrentEmploymentStatus
  ] = useState<CurrentEmploymentStatus>(CurrentEmploymentStatus.Student)
  const [ gender, setGender ] = useState<Gender>(Gender.Male)
  const [ isParent, setIsParent ] = useState<YesOrNo>(YesOrNo.No)
  const [ usState, setUSState ] = useState<USState>(USState.Alabama)
  const [ priorCompletion, setPriorCompletion ] = useState<YesOrNo>(YesOrNo.No)
    

  const title = `BESSI`
  const buttonText = `Submit`
  const subtitle = `Instructions.`


  // ------------------------ Input handler functions --------------------------
  function onPriorCompletionChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setPriorCompletion(value)
  } 

  function onGenderChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setGender(value)
  } 

  function onAgeChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setAge(value)
  } 

  function onRaceOrEthnicityChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setRaceOrEthnicity(value)
  } 

  function onEnglishFluencyChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setIsFluentInEnglish(value)
  } 

  function onSocialClassChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setSocialClass(value)
  } 

  function onUsLocationChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setUSState(value)
  } 

  function onZipCodeChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setZipCode(value)
  } 

  function onForeignLocationChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setForeignCountry(value)
  } 

  function onHighestEducationLevelChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setHighestFormalEducation(value)
  } 

  function onCurrentEmploymentStatusChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setCurrentEmploymentStatus(value)
  } 

  function onCurrentMaritalStatusChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setCurrentMaritalStatus(value)
  } 

  function onIsParentChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setIsParent(value)
  } 

  // --------------------------- Async functions -------------------------------
  async function handleSubmit(e: any): Promise<void> {
    if (userScores) {
      e.preventDefault()
      
      console.log(`userScores: `, userScores)

      const finalScores: {
        facetScores: FacetFactorType,
        domainScores: SkillDomainFactorType
      } = calculateBessiScores(Object.values(userScores))

      console.log(`finalScores: `, finalScores)

      setBessiSkillScores(finalScores)

      await storeResultsInDynamoDB(finalScores)

      // Navigate to the results page
      const href = '/bessi/assessment/results'
      router.push(href)
      
      await sendEmail()
    }
  }


  async function storeResultsInDynamoDB(
    finalScores: {
      facetScores: FacetFactorType,
      domainScores: SkillDomainFactorType
    },
  ) {
    const DEMOGRAPHICS = {
      age: age,
      gender: gender,
      usState: usState,
      zipCode: zipCode,
      isParent: isParent,
      foreignCountry: foreignCountry,
      englishFluency: isFluentInEnglish,
      priorCompletion: priorCompletion,
      socialClass: socialClass,
      raceOrEthnicity: raceOrEthnicity,
      currentMaritalStatus: currentMaritalStatus,
      highestFormalEducation: highestFormalEducation,
      currentEmploymentStatus: currentEmploymentStatus,
    }

    const CURRENT_TIMESTAMP = new Date().getTime()
    
    const email = await getUserEmailFromCookie()

    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      /**
       * @dev This is the object that we store in DynamoDB using AWS's 
       * `PutItemCommand` operation.
       */
      const userResults: BessiUserResults__DynamoDB = {
        email: email,
        timestamp: CURRENT_TIMESTAMP,
        facetScores: finalScores.facetScores,
        domainScores: finalScores.domainScores,
        demographics: DEMOGRAPHICS,
      }

      try {
        const response = await fetch('/bessi/assessment/api/post-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userResults }),
        })

        const data = await response.json()

        if (response.status === 200) {
          const message = data.message
          console.log(`message: `, message)
        } else {
          /**
           * @todo Handle error UI here
           */
          throw new Error(
            `Error posting BESSI results to DynamoDB: `, 
            data.error
          )

        }
      } catch (error: any) {
        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error! `, error)

      }
    }
  }


  async function getUserEmailFromCookie() {
    /**
     * @dev Note that the password that is returned is a hashed password
     */
    type CookieType = { email: string,  username: string, password: string }
    
    try {
      const response = await fetch('/bessi/assessment/api/get-jwt-secret', {
        method: 'GET'
      })

      const data = await response.json()

      if (response.status === 200) {
        const JWT_SECRET: string = data.secret
        const cookies = document.cookie        
        const token = cookies.split('=')[0]
        // Cannot use `verify()` because it is only used server-side
        const decoded = decode(token)
        const email = (decoded as CookieType).email

        return email
      } else {
        throw new Error(`Error getting JWT secret: ${ data.error }`,)
        /**
         * @todo Handle error UI here
         */
      }
    } catch (error: any) {
      throw new Error(`Error! ${ error }`)
      /**
       * @todo Handle error UI here
       */
    }
  }
  

  async function sendEmail() {

  }


  return (
    <Fragment key={ `bessi-assessment` }>
      <div className={ styles.assessmentWrapper }>
        <form
          className={ styles.grayColor }
          onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
        >
          <h2 className={ styles.assessmentTitle }>{ title }</h2>
          
          <BessiAssessmentInstructions />

          <UserScoresContext.Provider
            value={{
              userScores,
              setUserScores,
            }}
          >
            <BessiQuestionnaire />
          </UserScoresContext.Provider>

          <UserDemographicContext.Provider
            value={{ 
              onAgeChange,
              onGenderChange,
              onZipCodeChange,
              onIsParentChange,
              onUsLocationChange,
              onSocialClassChange,
              onEnglishFluencyChange,
              onRaceOrEthnicityChange,
              onPriorCompletionChange,
              onForeignLocationChange,
              onCurrentMaritalStatusChange,
              onHighestEducationLevelChange,
              onCurrentEmploymentStatusChange,
            }}
          >
            <BessiDemographicQuestionnaire />
          </UserDemographicContext.Provider>
          
          <div style={{ float: 'right' }}>
            <button className={ styles.button } style={{ width: '75px' }}>
              { buttonText }
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default BessiAssessment