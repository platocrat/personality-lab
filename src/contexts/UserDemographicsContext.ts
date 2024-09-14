import { createContext } from 'react'
import { UserDemographicsContextType } from './types'
import { USState, YesOrNo, SocialClass, RaceOrEthnicity, CurrentMaritalStatus, HighestFormalEducation, CurrentEmploymentStatus, Gender, Religion } from '@/utils'



const INIT_USER_DEMOGRAPHICS_CONTEXT: UserDemographicsContextType = {
  age: 20,
  gender: Gender.Male,
  usState: USState.Illinois,
  zipCode: '00000',
  religion: Religion.DontKnow,
  isParent: YesOrNo.No,
  familySize: 0,
  socialClass: SocialClass.LowerMiddleClass,
  foreignCountry: '',
  raceOrEthnicity: [
    RaceOrEthnicity.BlackAfricanAmerican,
    RaceOrEthnicity.HispanicLatinAmerican,
    RaceOrEthnicity.WhiteCaucasian,
  ],
  priorCompletion: YesOrNo.No,
  isFluentInEnglish: YesOrNo.Yes,
  currentMaritalStatus: CurrentMaritalStatus.NeverMarried,
  areaOfScienceTraining: '',
  annualHouseholdIncome: 0,
  highestFormalEducation: HighestFormalEducation.CollegeGraduate,
  currentEmploymentStatus: CurrentEmploymentStatus.Student,
  // Form input handlers
  onAgeChange: () => {},
  onGenderChange: () => {},
  onZipCodeChange: () => {},
  onReligionChange: () => {},
  onIsParentChange: () => {},
  onUsLocationChange: () => {},
  onFamilySizeChange: () => {},
  onSocialClassChange: () => {},
  onEnglishFluencyChange: () => {},
  onRaceOrEthnicityChange: () => {},
  onPriorCompletionChange: () => {},
  onForeignLocationChange: () => {},
  onCurrentMaritalStatusChange: () => {},
  onAreaOfScienceTrainingChange: () => {},
  onHighestEducationLevelChange: () => {},
  onAnnualHouseholdIncomeChange: () => {},
  onCurrentEmploymentStatusChange: () => {},
}



export const UserDemographicsContext = createContext<UserDemographicsContextType>(
  INIT_USER_DEMOGRAPHICS_CONTEXT
)