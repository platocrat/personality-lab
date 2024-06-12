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



// Function to generate random historical scores
function generateHistoricalScores(count: number): { score: number, timestamp: number }[] {
  const scores: { score: number, timestamp: number }[] = []
  for (let i = 0; i < count; i++) {
    scores.push({
      score: Math.floor(Math.random() * 101), // random score between 0 and 100
      timestamp: Date.now() - (i * 86400000) // decreasing timestamps by one day
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
      facetScores[facet as Facet] = generateHistoricalScores(10)
    }
  }

  // Fill domainScores with random historical data
  for (const domain in SkillDomain) {
    if (Object.prototype.hasOwnProperty.call(SkillDomain, domain)) {
      domainScores[domain as SkillDomain] = generateHistoricalScores(10)
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



const DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA = generateDummyUserProfileHistoricalAssessmentData()