// Locals
import { 
  YesOrNo,
  RaceOrEthnicity,
} from '@/utils'
import { 
  Religion,
  Gender__BigFive,
  MaritalStatus__BigFive,
  CurrentEmploymentStatus__BigFive,
  HighestLevelOfEducation__BigFive,
} from './enums'



export type BigFiveDemographicsType = {
  age: number
  familySize: number
  gender: string | number
  religion: string | number
  annualHouseholdIncome: number
  raceOrEthnicity: RaceOrEthnicity
  currentMaritalStatus: string | number
  areaOfScienceTraining: string | number
  highestEducationLevel: string | number
  currentEmploymentStatus: string | number
}


export type InputLabelEnumType = typeof YesOrNo 
  | typeof Religion 
  | typeof RaceOrEthnicity 
  | typeof Gender__BigFive
  | typeof MaritalStatus__BigFive
  | typeof CurrentEmploymentStatus__BigFive
  | typeof HighestLevelOfEducation__BigFive