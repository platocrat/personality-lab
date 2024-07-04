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



function generateRandomEnumValue(enumObject: any): any {
  const enumValues = Object.values(enumObject)
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  return enumValues[randomIndex]
}

function generateRandomZipCode(): string {
  return Math.floor(Math.random() * 90000 + 10000).toString().padStart(5, '0')
}

function generateRandomForeignCountry(): string {
  const countries = [
    'None', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
    'India', 'China', 'Japan', 'Australia', 'Brazil'
  ]
  const randomIndex = Math.floor(Math.random() * countries.length)
  return countries[randomIndex]
}

// Function to generate dummy historical assessment data for a user's profile
function generateDummyUserProfileHistoricalAssessmentData(): ExpectedTypeOfUserProfileAssessmentHistoricalData {
  const facetScores: { [key in Facet]: { score: number, timestamp: number }[] } = {} as any
  const domainScores: { [key in SkillDomain]: { score: number, timestamp: number }[] } = {} as any

  // Fill facetScores with random historical data
  for (const facet in Facet) {
    if (Object.prototype.hasOwnProperty.call(Facet, facet)) {
      facetScores[facet as Facet] = generateHistoricalScores(30, 70, 12)
    }
  }

  // Fill domainScores with random historical data
  for (const domain in SkillDomain) {
    if (Object.prototype.hasOwnProperty.call(SkillDomain, domain)) {
      domainScores[domain as SkillDomain] = generateHistoricalScores(30, 70, 12)
    }
  }

  // Dummy demographics with random values
  const demographics: BessiUserDemographics__DynamoDB = {
    age: Math.floor(Math.random() * 60) + 18, // Random age between 18 and 78
    gender: generateRandomEnumValue(Gender),
    usState: generateRandomEnumValue(USState),
    zipCode: generateRandomZipCode(),
    isParent: generateRandomEnumValue(YesOrNo),
    foreignCountry: generateRandomForeignCountry(),
    englishFluency: generateRandomEnumValue(YesOrNo),
    priorCompletion: generateRandomEnumValue(YesOrNo),
    socialClass: generateRandomEnumValue(SocialClass),
    raceOrEthnicity: generateRandomEnumValue(RaceOrEthnicity),
    currentMaritalStatus: generateRandomEnumValue(CurrentMaritalStatus),
    highestFormalEducation: generateRandomEnumValue(HighestFormalEducation),
    currentEmploymentStatus: generateRandomEnumValue(CurrentEmploymentStatus)
  }

  const dummyUserProfileHistoricalAssessmentData = {
    facetScores,
    domainScores,
    demographics
  }

  return dummyUserProfileHistoricalAssessmentData
}



export const DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA = generateDummyUserProfileHistoricalAssessmentData()