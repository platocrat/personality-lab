// Externals
import { ReactNode, FC, useState } from 'react'
// Locals
import { 
  YesOrNo, 
  USState, 
  SocialClass,
  RaceOrEthnicity,
} from '@/utils'
import { UserDemographicsContext } from '@/contexts/UserDemographicsContext'


type UserDemographicsLayoutProps = {
  children: ReactNode
}




const UserDemographicsLayout: FC<UserDemographicsLayoutProps> = ({
 children
}) => {
  // State variables UserDemographicsContext
  // Numbers
  const [age, setAge] = useState<number>(0)
  const [familySize, setFamilySize] = useState<number>(0)
  const [
    annualHouseholdIncome,
    setAnnualHouseholdIncome
  ] = useState<number>(0)
  // Regular strings
  const [
    areaOfScienceTraining,
    setAreaOfScienceTraining,
  ] = useState<string>('')
  const [zipCode, setZipCode] = useState<string>('')
  const [foreignCountry, setForeignCountry] = useState<string>('')
  // Enums
  const [isParent, setIsParent] = useState<YesOrNo>(YesOrNo.No)
  const [usState, setUSState] = useState<USState>(USState.Alabama)
  const [priorCompletion, setPriorCompletion] = useState<YesOrNo>(YesOrNo.No)
  const [
    isFluentInEnglish,
    setIsFluentInEnglish
  ] = useState<YesOrNo>(YesOrNo.No)
  const [
    raceOrEthnicity,
    setRaceOrEthnicity
  ] = useState<RaceOrEthnicity[]>([])
  // Generics
  const [
    highestFormalEducation,
    setHighestFormalEducation
  ] = useState<string | number>('')
  const [
    currentEmploymentStatus,
    setCurrentEmploymentStatus
  ] = useState<string | number>('')
  const [
    currentMaritalStatus,
    setCurrentMaritalStatus
  ] = useState<string | number>('')
  const [
    socialClass,
    setSocialClass
  ] = useState<SocialClass>(SocialClass.LowerMiddleClass)
  const [gender, setGender] = useState<string | number>('')
  const [religion, setReligion] = useState<string | number>('')


  

  // -------------------- Form Input handler functions -------------------------
  function onPriorCompletionChange(e: any) {
    const value = e.target.value
    // console.log(`e.target.value: `, e.target.value)
    setPriorCompletion(value)
  }

  function onGenderChange(e: any) {
    const _ = e.target.value
    // console.log(`gender: `, _)
    setGender(_)
  }

  function onAgeChange(e: any) {
    const _ = e.target.value
    // console.log(`age: `, _)
    setAge(_)
  }

  function onRaceOrEthnicityChange(e: any) {
    const _ = Object.values(RaceOrEthnicity)[e.target.value]

    setRaceOrEthnicity((previousState) => {
      if (previousState.includes(_)) {
        // If the current state is already in the array, remove it
        return previousState.filter(item => item !== _)
      } else {
        // Otherwise, add it to the array
        return [...previousState, _]
      }
    })
  }

  function onEnglishFluencyChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setIsFluentInEnglish(_)
  }

  function onSocialClassChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setSocialClass(_)
  }

  function onUsLocationChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setUSState(_)
  }

  function onZipCodeChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setZipCode(_)
  }

  function onForeignLocationChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setForeignCountry(_)
  }

  function onHighestEducationLevelChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setHighestFormalEducation(_)
  }

  function onCurrentEmploymentStatusChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setCurrentEmploymentStatus(_)
  }

  function onCurrentMaritalStatusChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setCurrentMaritalStatus(_)
  }

  function onIsParentChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const _ = e.target.value
    setIsParent(_)
  }

  function onFamilySizeChange(e: any) {
    const _ = e.target.value
    setFamilySize(_)
  }

  function onReligionChange(e: any) {
    const _ = e.target.value
    setReligion(_)
  }

  function onAnnualHouseholdIncomeChange(e: any) {
    const _ = e.target.value
    setAnnualHouseholdIncome(_)
  }

  function onAreaOfScienceTrainingChange(e: any) {
    const _ = e.target.value
    setAreaOfScienceTraining(_)
  }




  
  return (
    <>
      <UserDemographicsContext.Provider
        value={ {
          // State variables
          age,
          gender,
          usState,
          zipCode,
          religion,
          isParent,
          familySize,
          socialClass,
          foreignCountry,
          raceOrEthnicity,
          priorCompletion,
          isFluentInEnglish,
          currentMaritalStatus,
          areaOfScienceTraining,
          annualHouseholdIncome,
          highestFormalEducation,
          currentEmploymentStatus,
          // Form input handlers
          onAgeChange,
          onGenderChange,
          onZipCodeChange,
          onReligionChange,
          onIsParentChange,
          onUsLocationChange,
          onFamilySizeChange,
          onSocialClassChange,
          onEnglishFluencyChange,
          onRaceOrEthnicityChange,
          onPriorCompletionChange,
          onForeignLocationChange,
          onCurrentMaritalStatusChange,
          onAreaOfScienceTrainingChange,
          onHighestEducationLevelChange,
          onAnnualHouseholdIncomeChange,
          onCurrentEmploymentStatusChange,
        } }
      >
        { children }
      </UserDemographicsContext.Provider>
    </>
  )
}


export default UserDemographicsLayout