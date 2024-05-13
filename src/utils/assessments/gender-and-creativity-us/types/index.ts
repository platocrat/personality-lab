// Locals
import { 
  YesOrNo,
  RaceOrEthnicity, 
} from '@/utils'
import { 
  Religion,
  Gender__GACUsGender,
  MaritalStatus__GACUsGender,
  CurrentEmploymentStatus__GACUsGender,
  HighestLevelOfEducation__GACUsGender,
} from './enums'



export type GenderAndCreativityUsDemographicsType = {
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
  | typeof Gender__GACUsGender 
  | typeof MaritalStatus__GACUsGender 
  | typeof CurrentEmploymentStatus__GACUsGender 
  | typeof HighestLevelOfEducation__GACUsGender