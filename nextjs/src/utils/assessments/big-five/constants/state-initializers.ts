// Locals
import { RaceOrEthnicity } from '../../bessi/enums'
import { BigFiveDemographicsType } from '../types'
import { BIG_FIVE_ACTIVITY_BANK } from './constants'



export const INIT__BIG_FIVE_DEMOGRAPHICS: BigFiveDemographicsType = {
  age: 0,
  familySize: 0,
  gender: '',
  religion: '',
  annualHouseholdIncome: 0,
  currentMaritalStatus: '',
  areaOfScienceTraining: '',
  highestEducationLevel: '',
  currentEmploymentStatus: '',
  raceOrEthnicity: RaceOrEthnicity.Other,
}


export const INIT__ENGAGEMENT_LEVEL_RESPONSES: {
  [key: string]: boolean
} = BIG_FIVE_ACTIVITY_BANK.engagementLevels.reduce(
  (acc: { [key: string]: boolean }, eL: string): { [key: string]: boolean } => {
    acc[eL] = false
    return acc
  }, {}
)


export const INIT__ACTIVITY_RESPONSES = (
  actvityBankId: string
): { [key: string]: number } => BIG_FIVE_ACTIVITY_BANK[
  actvityBankId
].reduce(
  (acc: { [key: string]: number }, activity: string): { [key: string]: number } => {
    acc[activity] = 0
    return acc
  }, {}
)