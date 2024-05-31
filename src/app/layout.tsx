'use client'

// Externals
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// Locals
import Header from '@/components/Header'
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
import { CurrentParticipantStudyContext } from '@/contexts/CurrentParticipantStudyContext'
// Utils
import {
  YesOrNo,
  USState,
  SocialClass,
  RaceOrEthnicity,
} from '@/utils'
// Types
import { BessiSkillScoresType, STUDY_SIMPLE__DYNAMODB } from '@/utils'
// CSS
import './globals.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type UserType = { 
  email: string
  username: string 
  isAdmin: boolean
  isParticipant: boolean
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
}


export type UserResponse = {
  user: UserType | null
  error: Error | null
}




const INIT_USER = {
  email: '',
  username: '',
  isAdmin: false,
}




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Custom state variables
  const [ 
    bessiSkillScores, 
    setBessiSkillScores 
  ] = useState<BessiSkillScoresType | null>(null)
  // State variables for `UserType`
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const [ isParticipant, setIsParticipant ] = useState<boolean>(false)
  const [ userStudies, setUserStudies ] = useState<STUDY_SIMPLE__DYNAMODB[]>([])
  // State variables to select the participant's current study
  const [ 
    currentStudy, 
    setCurrentStudy 
  ] = useState<STUDY_SIMPLE__DYNAMODB | null>(null)
  // Booleans for user authentication
  const [ isInviteUrl, setIsInviteUrl] = useState<boolean>(false)
  const [ isFetchingUser, setIsFetchingUser ] = useState<boolean>(true)
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)
  // State variables UserDemographicsContext
  // Numbers
  const [ age, setAge ] = useState<number>(0)
  const [ familySize, setFamilySize ] = useState<number>(0)
  const [
    annualHouseholdIncome, 
    setAnnualHouseholdIncome 
  ] = useState<number>(0)
  // Regular strings
  const [
    areaOfScienceTraining,
    setAreaOfScienceTraining,
  ] = useState<string>('')
  const [ zipCode, setZipCode ] = useState<string>('')
  const [ foreignCountry, setForeignCountry ] = useState<string>('')
  // Enums
  const [ isParent, setIsParent ] = useState<YesOrNo>(YesOrNo.No)
  const [ usState, setUSState ] = useState<USState>(USState.Alabama)
  const [ priorCompletion, setPriorCompletion ] = useState<YesOrNo>(YesOrNo.No)
  const [
    isFluentInEnglish,
    setIsFluentInEnglish
  ] = useState<YesOrNo>(YesOrNo.No)
  const [
    raceOrEthnicity,
    setRaceOrEthnicity
  ] = useState<RaceOrEthnicity[]>([ ])
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
  const [ gender, setGender ] = useState<string | number>('')
  const [ religion, setReligion ] = useState<string | number>('')



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


  // --------------------------- Async functions -------------------------------
  async function getUser(): Promise<UserResponse> {
    try {
      const response = await fetch('/api/auth/user', { method: 'GET' })
      const json = await response.json()

      if (response.status === 401) return { user: null, error: json.message }
      if (response.status === 400) return { user: null, error: json.error }
      if (response.status === 500 && json.error.name === 'TokenExpiredError')
        return { user: null, error: json.error }

      const user_ = json.user as Omit<UserType, "studies">
      
      if (user_.isParticipant) {
        const userEmail = user_.email
        const study_ = await getUserStudies(user_.email)
        const user = { ...user_, study: study_ }
        return { user, error: null }
      } else {
        const user = { ...user_, study: undefined }
        return { user, error: null }
      }
      
    } catch (error: any) {
      return { user: null, error: error }
    }
  }


  async function getUserStudies(
    userEmail: string
  ): Promise<STUDY_SIMPLE__DYNAMODB | undefined> {
    try {
      const response = await fetch('/api/auth/user/studies', { method: 'GET' })
      const json = await response.json()

      if (response.status === 401) throw new Error(json.message)
      if (response.status === 400) throw new Error(json.error)
      if (response.status === 500 && json.error.name === 'TokenExpiredError')
        throw new Error(json.error)

      console.log(
        `[${new Date().toLocaleString() } --filepath="src/app/layout.tsx" --function="getUserStudies()"]: json: `, 
        json
      )

      const study = json.study as STUDY_SIMPLE__DYNAMODB | undefined
      return study
    } catch (error: any) {
      throw new Error(error)
    }
  }


  /**
   * @dev Protects any page by restricting access to users that have already 
   *      authenticated and hold a session cookie.
   */
  async function pageProtection(): Promise<void> {
    setIsFetchingUser(true)

    const { user, error } = await getUser()


    if (error) {
      // Prompt user to log in 
      const timeout = 200 // 100 ms

      if (pathname !== undefined) {
        if (pathname.startsWith('/invite/')) {
          setIsInviteUrl(true)
          setIsFetchingUser(false)
          // End the if/else control statement here
          return 
        }

        pathname === '/' ? router.refresh() : router.push('/')
  
        setIsAuthenticated(false)
  
        // Avoid flashing the blocked page for a split second
        setTimeout(() => {
          setIsFetchingUser(false)
        }, timeout)

        return
      }
    } else {
      // Update state of the user
      setEmail((user as UserType).email)
      setUsername((user as UserType).username)
      setUserStudies((user as UserType).studies ?? [])
      // Update state of the kind of user
      setIsParticipant((user as UserType).isParticipant)
      setIsAdmin((user as UserType).isAdmin)
      // Show the dashboard
      setIsAuthenticated(true)
      setIsFetchingUser(false)
    }
  }


  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    const requests = [
      pageProtection(),
    ]

    Promise.all(requests).then((response: any): void => { })
  }, [router, pathname])



  return (
    <>
      { isFetchingUser ? (
        <>
          <html lang='en'>
            <body>
              <div
                style={ {
                  ...definitelyCenteredStyle,
                  position: 'relative',
                  top: '80px',
                } }
              >
                <Spinner height='40' width='40' />
              </div>
            </body>
          </html>
        </>
      ) : (
        <>
          <html lang='en'>
            <body>
              <AuthenticatedUserContext.Provider
                value={{
                  email,
                  isAdmin,
                  username,
                  setEmail,
                  setIsAdmin,
                  userStudies,
                  setUsername,
                  isParticipant,
                  setUserStudies,
                  isAuthenticated,
                  setIsParticipant,
                  setIsAuthenticated,
                }}
              >
                <CurrentParticipantStudyContext.Provider
                  value={{
                    currentStudy,
                    setCurrentStudy,
                  }}
                >
                  <UserDemographicContext.Provider
                    value={{
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
                    }}
                  >
                    <BessiSkillScoresContext.Provider
                      value={{
                        bessiSkillScores,
                        setBessiSkillScores,
                      }}
                    >
                      { isAuthenticated && <Header/> }
                      { children }
                    </BessiSkillScoresContext.Provider>
                  </UserDemographicContext.Provider>
                </CurrentParticipantStudyContext.Provider>
              </AuthenticatedUserContext.Provider>
            </body>
          </html>
        </>
      ) }
    </>
  )
}
