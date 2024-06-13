import { 
  Facet, 
  Gender, 
  USState, 
  YesOrNo,
  SkillDomain, 
  SocialClass, 
  RaceOrEthnicity, 
  CurrentMaritalStatus, 
  HighestFormalEducation, 
  CurrentEmploymentStatus, 
  BessiUserDemographics__DynamoDB, 
} from '@/utils'



type HistoricalScoresType = {
  score: number
  timestamp: number
}[]

type ExpectedTypeOfUserProfileAssessmentHistoricalData = {
  facetScores: {
    [key in Facet]: HistoricalScoresType
  },
  domainScores: {
    [key in SkillDomain]: HistoricalScoresType
  },
  demographics: any | BessiUserDemographics__DynamoDB
}



// Function to generate random historical scores with a normal distribution
function generateHistoricalScores(count: number, mean: number, stddev: number): { score: number, timestamp: number }[] {
  const scores: { score: number, timestamp: number }[] = []

  // Box-Muller transform to generate normally distributed random numbers
  function generateNormalRandom(mean: number, stddev: number): number {
    let u = 0, v = 0
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random() // Converting [0,1) to (0,1)
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return z * stddev + mean
  }

  for (let i = 0; i < count; i++) {
    let score = Math.round(generateNormalRandom(mean, stddev))
    // Clamp the score to be between 0 and 100
    score = Math.max(0, Math.min(100, score))

    scores.push({
      score,
      timestamp: Date.now() - ((count - i - 1) * 86400000) // Increasing timestamps by one day
    })
  }

  return scores
}



// Function to generate dummy historical assessment data for a user's profile
function generateDummyUserProfileHistoricalAssessmentData(): ExpectedTypeOfUserProfileAssessmentHistoricalData {
  const facetScores: { [key in Facet]: { score: number, timestamp: number }[] } = {} as any
  const domainScores: { [key in SkillDomain]: { score: number, timestamp: number }[] } = {} as any

  // Fill facetScores with random historical data
  for (const facet in Facet) {
    if (Object.prototype.hasOwnProperty.call(Facet, facet)) {
      facetScores[facet as Facet] = generateHistoricalScores(10, 70, 12)
    }
  }

  // Fill domainScores with random historical data
  for (const domain in SkillDomain) {
    if (Object.prototype.hasOwnProperty.call(SkillDomain, domain)) {
      domainScores[domain as SkillDomain] = generateHistoricalScores(10, 70, 12)
    }
  }

  // Dummy demographics
  const demographics: BessiUserDemographics__DynamoDB = {
    age: 30,
    gender: Gender.Male,
    usState: USState.California,
    zipCode: '90001',
    isParent: YesOrNo.No,
    foreignCountry: 'None',
    englishFluency: YesOrNo.Yes,
    priorCompletion: YesOrNo.Yes,
    socialClass: SocialClass.MiddleClass,
    raceOrEthnicity: RaceOrEthnicity.WhiteCaucasian,
    currentMaritalStatus: CurrentMaritalStatus.NeverMarried,
    highestFormalEducation: HighestFormalEducation.Doctorate,
    currentEmploymentStatus: CurrentEmploymentStatus.WorkFullTime
  }

  const dummyUserProfileHistoricalAssessmentData = {
    facetScores,
    domainScores,
    demographics
  }

  console.log(
    `dummyUserProfileHistoricalAssessmentData: `,
    dummyUserProfileHistoricalAssessmentData
  )

  return dummyUserProfileHistoricalAssessmentData
}



export const DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA = generateDummyUserProfileHistoricalAssessmentData()