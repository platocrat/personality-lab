'use client';

// Externals
import Link from 'next/link'
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
// Utils
import { calculateBessiScores } from '@/utils'
// Types
import { 
  FacetFactorType,
  SkillDomainFactorType,
  UserScoresType
} from '@/utils/bessi/types'
// Enums
import { 
  Gender, 
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
  const [age, setAge] = useState<number>(0)
  // String
  const [zipCode, setZipCode] = useState<string>('')
  const [foreignCountry, setForeignCountry] = useState<string>('')
  // Booleans
  const [
    hasPreviouslyCompleted,
    setHasPreviouslyCompleted
  ] = useState<boolean>(false)
  const [ isParent, setIsParent ] = useState<boolean>(false)
  const [ isFluentInEnglish, setIsFluentInEnglish ] = useState<boolean>(false)
  // Enums
  const [
    gender,
    setGender
  ] = useState<Gender>(Gender.Male)
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
  const [usState, setUSState] = useState<USState>(USState.Alabama)
  
  const title = `BESSI`
  const subtitle = `Instructions.`


  // ------------------------ Input handler functions --------------------------
  function onPriorCompletionChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setHasPreviouslyCompleted(value)
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

      const href = '/bessi/assessment/results'
      router.push(href)
      
      await sendEmail()
    }
  }

  async function sendEmail() {}


  return (
    <Fragment key={ `bessi-assessment` }>
      <div className={ styles.assessmentWrapper }>
        <form
          className={ styles.grayColor }
          onSubmit={ (e: any): Promise<void> => handleSubmit(e) }
        >
          <h2 className={ styles.assessmentTitle }>{ title.toUpperCase() }</h2>
          
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
          
          <div style={ { float: 'right' } }>
            <button className={ styles.button }>
              { `Submit` }
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default BessiAssessment