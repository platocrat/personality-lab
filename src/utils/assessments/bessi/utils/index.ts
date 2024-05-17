// Constants
import {
  bessiActivityBank,
  skillDomainMapping,
} from '../constants'
// Enums
import { Facet, SkillDomain } from '../enums'
// Types
import {
  UserScoresType,
  FacetFactorType,
  SkillDomainFactorType,
} from '../types'



export function getFacet(activityId: number): Facet {
  const facetMapping: { [key: number]: Facet } = {
    3: Facet.TimeManagement, 35: Facet.TimeManagement, 67: Facet.TimeManagement,
    99: Facet.TimeManagement, 131: Facet.TimeManagement, 163: Facet.TimeManagement,
    6: Facet.OrganizationalSkill, 38: Facet.OrganizationalSkill, 70: Facet.OrganizationalSkill,
    102: Facet.OrganizationalSkill, 134: Facet.OrganizationalSkill, 166: Facet.OrganizationalSkill,
    9: Facet.CapacityForConsistency, 41: Facet.CapacityForConsistency, 73: Facet.CapacityForConsistency,
    105: Facet.CapacityForConsistency, 137: Facet.CapacityForConsistency, 169: Facet.CapacityForConsistency,
    12: Facet.TaskManagement, 44: Facet.TaskManagement, 76: Facet.TaskManagement,
    108: Facet.TaskManagement, 140: Facet.TaskManagement, 172: Facet.TaskManagement,
    15: Facet.DetailManagement, 47: Facet.DetailManagement, 79: Facet.DetailManagement,
    111: Facet.DetailManagement, 143: Facet.DetailManagement, 175: Facet.DetailManagement,
    18: Facet.RuleFollowingSkill, 50: Facet.RuleFollowingSkill, 82: Facet.RuleFollowingSkill,
    114: Facet.RuleFollowingSkill, 146: Facet.RuleFollowingSkill, 178: Facet.RuleFollowingSkill,
    21: Facet.ResponsibilityManagement, 53: Facet.ResponsibilityManagement, 85: Facet.ResponsibilityManagement,
    117: Facet.ResponsibilityManagement, 149: Facet.ResponsibilityManagement, 181: Facet.ResponsibilityManagement,
    24: Facet.GoalRegulation, 56: Facet.GoalRegulation, 88: Facet.GoalRegulation,
    120: Facet.GoalRegulation, 152: Facet.GoalRegulation, 184: Facet.GoalRegulation,
    27: Facet.DecisionMakingSkill, 59: Facet.DecisionMakingSkill, 91: Facet.DecisionMakingSkill,
    123: Facet.DecisionMakingSkill, 155: Facet.DecisionMakingSkill, 187: Facet.DecisionMakingSkill,
    1: Facet.LeadershipSkill, 33: Facet.LeadershipSkill, 65: Facet.LeadershipSkill,
    97: Facet.LeadershipSkill, 129: Facet.LeadershipSkill, 161: Facet.LeadershipSkill,
    13: Facet.PersuasiveSkill, 45: Facet.PersuasiveSkill, 77: Facet.PersuasiveSkill,
    109: Facet.PersuasiveSkill, 141: Facet.PersuasiveSkill, 173: Facet.PersuasiveSkill,
    17: Facet.ExpressiveSkill, 49: Facet.ExpressiveSkill, 81: Facet.ExpressiveSkill,
    113: Facet.ExpressiveSkill, 145: Facet.ExpressiveSkill, 177: Facet.ExpressiveSkill,
    25: Facet.ConversationalSkill, 57: Facet.ConversationalSkill, 89: Facet.ConversationalSkill,
    121: Facet.ConversationalSkill, 153: Facet.ConversationalSkill, 185: Facet.ConversationalSkill,
    7: Facet.EnergyRegulation, 39: Facet.EnergyRegulation, 71: Facet.EnergyRegulation,
    103: Facet.EnergyRegulation, 135: Facet.EnergyRegulation, 167: Facet.EnergyRegulation,
    2: Facet.PerspectiveTakingSkill, 34: Facet.PerspectiveTakingSkill, 66: Facet.PerspectiveTakingSkill,
    98: Facet.PerspectiveTakingSkill, 130: Facet.PerspectiveTakingSkill, 162: Facet.PerspectiveTakingSkill,
    8: Facet.CapacityForTrust, 40: Facet.CapacityForTrust, 72: Facet.CapacityForTrust,
    104: Facet.CapacityForTrust, 136: Facet.CapacityForTrust, 168: Facet.CapacityForTrust,
    14: Facet.CapacityForSocialWarmth, 46: Facet.CapacityForSocialWarmth, 78: Facet.CapacityForSocialWarmth,
    110: Facet.CapacityForSocialWarmth, 142: Facet.CapacityForSocialWarmth, 174: Facet.CapacityForSocialWarmth,
    23: Facet.TeamworkSkill, 55: Facet.TeamworkSkill, 87: Facet.TeamworkSkill,
    119: Facet.TeamworkSkill, 151: Facet.TeamworkSkill, 183: Facet.TeamworkSkill,
    29: Facet.EthicalCompetence, 61: Facet.EthicalCompetence, 93: Facet.EthicalCompetence,
    125: Facet.EthicalCompetence, 157: Facet.EthicalCompetence, 189: Facet.EthicalCompetence,
    5: Facet.StressRegulation, 37: Facet.StressRegulation, 69: Facet.StressRegulation,
    101: Facet.StressRegulation, 133: Facet.StressRegulation, 165: Facet.StressRegulation,
    11: Facet.CapacityForOptimism, 43: Facet.CapacityForOptimism, 75: Facet.CapacityForOptimism,
    107: Facet.CapacityForOptimism, 139: Facet.CapacityForOptimism, 171: Facet.CapacityForOptimism,
    20: Facet.AngerManagement, 52: Facet.AngerManagement, 84: Facet.AngerManagement,
    116: Facet.AngerManagement, 148: Facet.AngerManagement, 180: Facet.AngerManagement,
    26: Facet.ConfidenceRegulation, 58: Facet.ConfidenceRegulation, 90: Facet.ConfidenceRegulation,
    122: Facet.ConfidenceRegulation, 154: Facet.ConfidenceRegulation, 186: Facet.ConfidenceRegulation,
    30: Facet.ImpulseRegulation, 62: Facet.ImpulseRegulation, 94: Facet.ImpulseRegulation,
    126: Facet.ImpulseRegulation, 158: Facet.ImpulseRegulation, 190: Facet.ImpulseRegulation,
    4: Facet.AbstractThinkingSkill, 36: Facet.AbstractThinkingSkill, 68: Facet.AbstractThinkingSkill,
    100: Facet.AbstractThinkingSkill, 132: Facet.AbstractThinkingSkill, 164: Facet.AbstractThinkingSkill,
    16: Facet.CreativeSkill, 48: Facet.CreativeSkill, 80: Facet.CreativeSkill,
    112: Facet.CreativeSkill, 144: Facet.CreativeSkill, 176: Facet.CreativeSkill,
    28: Facet.ArtisticSkill, 60: Facet.ArtisticSkill, 92: Facet.ArtisticSkill,
    124: Facet.ArtisticSkill, 156: Facet.ArtisticSkill, 188: Facet.ArtisticSkill,
    32: Facet.CulturalCompetence, 64: Facet.CulturalCompetence, 96: Facet.CulturalCompetence,
    128: Facet.CulturalCompetence, 160: Facet.CulturalCompetence, 192: Facet.CulturalCompetence,
    22: Facet.InformationProcessingSkill, 54: Facet.InformationProcessingSkill, 86: Facet.InformationProcessingSkill,
    118: Facet.InformationProcessingSkill, 150: Facet.InformationProcessingSkill, 182: Facet.InformationProcessingSkill,
    10: Facet.SelfReflectionSkill, 42: Facet.SelfReflectionSkill, 74: Facet.SelfReflectionSkill,
    106: Facet.SelfReflectionSkill, 138: Facet.SelfReflectionSkill, 170: Facet.SelfReflectionSkill,
    19: Facet.Adaptability, 51: Facet.Adaptability, 83: Facet.Adaptability,
    115: Facet.Adaptability, 147: Facet.Adaptability, 179: Facet.Adaptability,
    31: Facet.CapacityForIndependence, 63: Facet.CapacityForIndependence, 95: Facet.CapacityForIndependence,
    127: Facet.CapacityForIndependence, 159: Facet.CapacityForIndependence, 191: Facet.CapacityForIndependence
  }

  return facetMapping[activityId]
}


export function getSkillDomainAndWeight(facet: Facet): {
  domain: SkillDomain[],
  weight: number
} {
  const skillDomainMapping: { [key: string]: { domain: SkillDomain[], weight: number } } = {
    // Self-Management Skills (Full Weight)
    [Facet.TimeManagement]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.OrganizationalSkill]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.CapacityForConsistency]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.TaskManagement]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.DetailManagement]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.RuleFollowingSkill]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.ResponsibilityManagement]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.GoalRegulation]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    [Facet.DecisionMakingSkill]: { domain: [SkillDomain.SelfManagement], weight: 1 },
    // Self-Management Skills (Half Weight)
    [Facet.EnergyRegulation]: { domain: [SkillDomain.SelfManagement, SkillDomain.SocialEngagement], weight: 0.5 },
    [Facet.EthicalCompetence]: { domain: [SkillDomain.SelfManagement, SkillDomain.Cooperation], weight: 0.5 },
    [Facet.ImpulseRegulation]: { domain: [SkillDomain.SelfManagement, SkillDomain.EmotionalResilience], weight: 0.5 },
    [Facet.InformationProcessingSkill]: { domain: [SkillDomain.SelfManagement, SkillDomain.Innovation], weight: 0.5 },
    // Social Engagement Skills
    [Facet.LeadershipSkill]: { domain: [SkillDomain.SocialEngagement], weight: 1 },
    [Facet.PersuasiveSkill]: { domain: [SkillDomain.SocialEngagement], weight: 1 },
    [Facet.ExpressiveSkill]: { domain: [SkillDomain.SocialEngagement], weight: 1 },
    [Facet.ConversationalSkill]: { domain: [SkillDomain.SocialEngagement], weight: 1 },
    // Cooperation Skills
    [Facet.PerspectiveTakingSkill]: { domain: [SkillDomain.Cooperation], weight: 1 },
    [Facet.CapacityForTrust]: { domain: [SkillDomain.Cooperation], weight: 1 },
    [Facet.CapacityForSocialWarmth]: { domain: [SkillDomain.Cooperation], weight: 1 },
    [Facet.TeamworkSkill]: { domain: [SkillDomain.Cooperation], weight: 1 },
    // Emotional Resilience Skills
    [Facet.StressRegulation]: { domain: [SkillDomain.EmotionalResilience], weight: 1 },
    [Facet.CapacityForOptimism]: { domain: [SkillDomain.EmotionalResilience], weight: 1 },
    [Facet.AngerManagement]: { domain: [SkillDomain.EmotionalResilience], weight: 1 },
    [Facet.ConfidenceRegulation]: { domain: [SkillDomain.EmotionalResilience], weight: 1 },
    // Innovation Skills
    [Facet.AbstractThinkingSkill]: { domain: [SkillDomain.Innovation], weight: 1 },
    [Facet.CreativeSkill]: { domain: [SkillDomain.Innovation], weight: 1 },
    [Facet.ArtisticSkill]: { domain: [SkillDomain.Innovation], weight: 1 },
    [Facet.CulturalCompetence]: { domain: [SkillDomain.Innovation], weight: 1 }
  }

  // Default to no domain and zero weight
  return skillDomainMapping[facet] || { domain: [], weight: 0 }
}


/**
 * @dev Calculates the average scores for each facet and skill domain based on 
 * the provided user `scores` array.
 * Example usage
 * ```ts
 * const exampleScores = [
 *   { facet: getFacet(1), ...getSkillDomainAndWeight(getFacet(1)), response: 4 },
 *   { facet: getFacet(2), ...getSkillDomainAndWeight(getFacet(2)), response: 1 },
 *   // ... other scores ...
 * ]
 * const calculatedScores = calculateScores(exampleScores)
 * console.log(calculatedScores)
 * ```
 */
export function calculateBessiScores(scores: UserScoresType[]): {
  facetScores: FacetFactorType,
  domainScores: SkillDomainFactorType
} {
  // Initialize objects to hold scores and counts
  let facetScores: FacetFactorType = {},
    facetCounts: FacetFactorType = {},
    domainScores: SkillDomainFactorType = {},
    domainWeights: SkillDomainFactorType = {}

  // Calculate facet scores and counts
  for (const score of scores) {
    const facet = score.facet;
    facetScores[facet] = (facetScores[facet] || 0) + score.response
    facetCounts[facet] = (facetCounts[facet] || 0) + 1
  }

  // Calculate domain scores and weights
  for (const score of scores) {
    for (const domain of score.domain) {
      domainScores[domain] = (
        (domainScores[domain] || 0) + score.response * score.weight
      )
      domainWeights[domain] = (domainWeights[domain] || 0) + score.weight
    }
  }

  // Convert facet scores to percentage out of 100
  for (const facet in facetScores) {
    const maxScore = 5 * facetCounts[facet]
    facetScores[facet] = Math.round((facetScores[facet] / maxScore) * 100)
  }

  // Convert domain scores to percentage out of 100
  for (const domain in domainScores) {
    const maxScore = 5 * domainWeights[domain]
    domainScores[domain] = Math.round((domainScores[domain] / maxScore) * 100)
  }

  return { facetScores, domainScores }
}