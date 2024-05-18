// Locals
import { RaceOrEthnicity } from '../../bessi/enums'
import { BigFiveDemographicsType } from '../types'
import { BIG_FIVE_ACTIVITY_BANK } from './constants'



export const Init__BigFiveDemographics: BigFiveDemographicsType = {
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


export const Init__EngagementLevelResponses: {
  [key: string]: boolean
} = BIG_FIVE_ACTIVITY_BANK.engagementLevels.reduce(
  (acc: { [key: string]: boolean }, eL: string): { [key: string]: boolean } => {
    acc[eL] = false
    return acc
  }, {}
)


export const Init__ActivitiyResponses = (
  actvityBankId: string
): { [key: string]: number } => BIG_FIVE_ACTIVITY_BANK[
  actvityBankId
].reduce(
  (acc: { [key: string]: number }, activity: string): { [key: string]: number } => {
    acc[activity] = 0
    return acc
  }, {}
)