// Utility functions
import { getFacet, getSkillDomainAndWeight } from '../utils'
// Types
import { Facet, SkillDomain } from '../enums'
// Enums
import { BessiActivityType } from '../types'
import { getRandomValueInRange } from '@/utils/misc'


// Invalid characters for strings
export const INVALID_CHARS_FOR_NUMBERS = ['-', '+', 'e', '.']
export const INVALID_CHARS_WITH_NUMBERS = [
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '`', '~', '-',
  '=', '[', ']', '\\', ';', "'", ',', '.', '/', '{', '}', '|', ':', '"', '<',
  '>', '?', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
]
export const INVALID_CHARS_EXCEPT_NUMBERS = [
  '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '`', '~', '-', 
  '=', '[', ']', '\\', ';', "'", ',', '.', '/', '{', '}', '|', ':', '"', '<', 
  '>', '?', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 
  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 
  'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export const wellnessRatings = [1, 2, 3, 4, 5]
export const wellnessRatingDescriptions = [
  `Not at all well`,
  `Not very well`,
  `Pretty well`,
  `Very well`,
  `Extremely well`,
]


export const imgPaths = () => {
  const basePath = `/icons`
  return {
    svg: `${basePath}/svg/`,
    png: `${basePath}/png/`,
  }
}


/**
 * # Dummy variables for BESSI assessment results
 */
export const dummyUserBessiScores = {
  domainScores: {
    'Self-Management Skills': Math.floor(Math.random() * 100),
    'Social Engagement Skills': Math.floor(Math.random() * 100),
    'Cooperation Skills': Math.floor(Math.random() * 100),
    'Emotional Resilience Skills': Math.floor(Math.random() * 100),
    'Innovation Skills': Math.floor(Math.random() * 100),
  },
  facetScores: {
    'Time Management': Math.floor(Math.random() * 100),
    'Organizational Skill': Math.floor(Math.random() * 100),
    'Capacity for Consistency': Math.floor(Math.random() * 100),
    'Task Management': Math.floor(Math.random() * 100),
    'Detail Management': Math.floor(Math.random() * 100),
    'Rule-Following Skill': Math.floor(Math.random() * 100),
    'Responsibility Management': Math.floor(Math.random() * 100),
    'Goal Regulation': Math.floor(Math.random() * 100),
    'Decision-Making Skill': Math.floor(Math.random() * 100),
    'Leadership Skill': Math.floor(Math.random() * 100),
    'Persuasive Skill': Math.floor(Math.random() * 100),
    'Expressive Skill': Math.floor(Math.random() * 100),
    'Conversational Skill': Math.floor(Math.random() * 100),
    'Energy Regulation': Math.floor(Math.random() * 100),
    'Perspective-Taking Skill': Math.floor(Math.random() * 100),
    'Capacity for Trust': Math.floor(Math.random() * 100),
    'Capacity for Social Warmth': Math.floor(Math.random() * 100),
    'Teamwork Skill': Math.floor(Math.random() * 100),
    'Ethical Competence': Math.floor(Math.random() * 100),
    'Stress Regulation': Math.floor(Math.random() * 100),
    'Capacity for Optimism': Math.floor(Math.random() * 100),
    'Anger Management': Math.floor(Math.random() * 100),
    'Confidence Regulation': Math.floor(Math.random() * 100),
    'Impulse Regulation': Math.floor(Math.random() * 100),
    'Abstract Thinking Skill': Math.floor(Math.random() * 100),
    'Creative Skill': Math.floor(Math.random() * 100),
    'Artistic Skill': Math.floor(Math.random() * 100),
    'Cultural Competence': Math.floor(Math.random() * 100),
    'Information Processing Skill': Math.floor(Math.random() * 100),
    'Self-Reflection Skill': Math.floor(Math.random() * 100),
    'Adaptability': Math.floor(Math.random() * 100),
    'Capacity for Independence': Math.floor(Math.random() * 100),
  }
}


export function getDummyPopulationBessiScores(
  n: number, 
  domainOrFacet: 'facet' | 'domain'
): { [key: string]: number[] } {
  let keys: string[] = []

  if (domainOrFacet === 'domain') {
    keys = Object.keys(dummyUserBessiScores.domainScores)
  } else if (domainOrFacet === 'facet') {
    keys = Object.keys(dummyUserBessiScores.facetScores)
  } else {
    const error = 'Could not get dummy population scores because did not specify whether output is for facet or domain.'
    throw new Error(error)
  }

  let populationScores: { [key: string]: number[] } = {}

  for (let i = 0; i < n; i++) {
    // For each domain name
    keys.forEach((key: string) => {
      // Push the user's score to the array of scores for this key.
      const value = getRandomValueInRange(40, 80)
      const values = populationScores[key] 
        ? [ ...populationScores[key], value ] 
        : [ value ]

      populationScores[key] = values
    })
  }

  return populationScores
}



// Mappings
export const facetMapping: { [key: number]: Facet } = {
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

export const domainToFacetMapping = {
  "Self-Management Skills": [
    'Task Management',
    'Time Management',
    'Detail Management',
    'Organizational Skill',
    'Responsibility Management',
    'Capacity for Consistency',
    'Goal Regulation',
    'Rule-Following Skill',
    'Decision-Making Skill',
  ],
  "Social Engagement Skills": [
    'Leadership Skill',
    'Persuasive Skill',
    'Conversational Skill',
    'Expressive Skill',
    'Energy Regulation',
  ],
  "Cooperation Skills": [
    'Teamwork Skill',
    'Capacity for Trust',
    'Perspective-Taking Skill',
    'Capacity for Social Warmth',
    'Ethical Competence',
  ],
  "Emotional Resilience Skills": [
    'Stress Regulation',
    'Capacity for Optimism',
    'Anger Management',
    'Confidence Regulation',
    'Impulse Regulation',
  ],
  "Innovation Skills": [
    'Abstract Thinking Skill',
    'Creative Skill',
    'Artistic Skill',
    'Cultural Competence',
    'Information Processing Skill',
  ],
}




export const skillDomainMapping: { [key: string]: { domain: SkillDomain[], weight: number } } = {
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



export const skillsMapping = {
  tableHeaders: [
    `Skill Domain Score`,
    `Skill Facet Scores`,
    `Skill Definition`
  ],
  domains: {
    'Self-Management Skills': {
      description: `Capacities that people use to effectively pursue goals and complete tasks.`,
      facets: {
        'Task Management': `Working persistently to complete tasks and achieve goal.`,
        'Time Management': `Using time effectively while accomplishing goals.`,
        'Detail Management': `Doing careful and thorough work.`,
        'Organizational Skill': `Organizing personal spaces and objects.`,
        'Responsibility Management': `Fulfilling promises and commitments.`,
        'Capacity for Consistency': `Reliably performing routine tasks`,
        'Goal Regulation': `Setting clear and ambitious personal goals.`,
        'Rule-Following Skill': `Following instructions, rules, and norms.`,
        'Decision-Making Skill': `Making well-reasoned, deliberate decisions.`,
      },
    },
    'Social Engagement Skills': {
      description: `Capacities that people use to actively engage with others in one-on-one and group interactions.`,
      facets: {
        'Leadership Skill': `Asserting one's views and speaking in a group.`,
        'Persuasive Skill': `Presenting arguments effectively.`,
        'Conversational Skill': `Initiating and maintaining social interactions.`,
        'Expressive Skill': `Communicating one's thoughts and feelings to other people.`,
        'Energy Regulation': `Channeling energy in a productive way.`,
      },
    },
    'Cooperation Skills': {
      description: `Capacities that people use to maintain positive, harmonious, and satisfying social relationships.`,
      facets: {
        'Teamwork Skill': `Working effectively with other people to achieve shared goals.`,
        'Capacity for Trust': `Forgiving others and seeing the good in people.`,
        'Perspective-Taking Skill': `Sympathizing with and understanding how others feel.`,
        'Capacity for Social Warmth': `Making people feel comfortable and happy.`,
        'Ethical Competence': `Behave ethically, even in difficult situations.`,
      },
    },
    'Emotional Resilience Skills': {
      description: `Capacities that people use to regulate their emotions and moods.`,
      facets: {
        'Stress Regulation': `Regulating stress, anxiety, and fear.`,
        'Capacity for Optimism': `Maintaining a positive attitude in difficult situations.`,
        'Anger Management': `Regulating anger and irritation.`,
        'Confidence Regulation': `Maintaining a positive attitude toward oneself.`,
        'Impulse Regulation': `Intentionally resisting impulses.`,
      }
    },
    'Innovation Skills': {
      description: `Capacities that people use to create, engage with, and learn from new ideas and experiences.`,
      facets: {
        'Abstract Thinking Skill': `Engaging with abstract ideas.`,
        'Creative Skill': `Generating new ideas.`,
        'Artistic Skill': `Creating and appreciating art.`,
        'Cultural Competence': `Understanding and appreciating different cultural backgrounds.`,
        'Information Processing Skill': `Processing and applying new information.`,
      },
    },
    'Compound Skills': {
      description: `Skills that combine aspects of multiple skills domains.`,
      facets: {
        'Adaptability': `Trying new things and adapting to change.`,
        'Capacity for Independence': `Thinking, working, and making decisions by oneself.`,
        'Self-Reflection Skill': `Understanding one’s own thoughts and feelings.`,
      },
    },
  },
}




export const bessiActivityBank: BessiActivityType[] = [
  {
    id: 1,
    activity: `Lead a group of people.`,
    facet: getFacet(1),
    ...getSkillDomainAndWeight(getFacet(1)),
  },
  {
    id: 2,
    activity: `Sympathize with other people's feelings.`,
    facet: getFacet(2),
    ...getSkillDomainAndWeight(getFacet(2)),
  },
  {
    id: 3,
    activity: `Show up for things on time.`,
    facet: getFacet(3),
    ...getSkillDomainAndWeight(getFacet(3)),
  },
  {
    id: 4,
    activity: `Understand abstract ideas.`,
    facet: getFacet(4),
    ...getSkillDomainAndWeight(getFacet(4)),
  },
  {
    id: 5,
    activity: `Stay calm in stressful situations.`,
    facet: getFacet(5),
    ...getSkillDomainAndWeight(getFacet(5)),
  },
  {
    id: 6,
    activity: `Tidy up after myself.`,
    facet: getFacet(6),
    ...getSkillDomainAndWeight(getFacet(6)),
  },
  {
    id: 7,
    activity: `Use my energy in productive ways.`,
    facet: getFacet(7),
    ...getSkillDomainAndWeight(getFacet(7)),
  },
  {
    id: 8,
    activity: `Let go of a grudge.`,
    facet: getFacet(8),
    ...getSkillDomainAndWeight(getFacet(8)),
  },
  {
    id: 9,
    activity: `Repeat a task consistently.`,
    facet: getFacet(9),
    ...getSkillDomainAndWeight(getFacet(9)),
  },
  {
    id: 10,
    activity: `Look inside myself.`,
    facet: getFacet(10),
    ...getSkillDomainAndWeight(getFacet(10)),
  },
  // {
  //   id: 11,
  //   activity: `Stop myself from feeling pessimistic.`,
  //   facet: getFacet(11),
  //   ...getSkillDomainAndWeight(getFacet(11)),
  // },
  // {
  //   id: 12,
  //   activity: `Keep working until a task is finished.`,
  //   facet: getFacet(12),
  //   ...getSkillDomainAndWeight(getFacet(12)),
  // },
  // {
  //   id: 13,
  //   activity: `Win debates with other people.`,
  //   facet: getFacet(13),
  //   ...getSkillDomainAndWeight(getFacet(13)),
  // },
  // {
  //   id: 14,
  //   activity: `Make people smile.`,
  //   facet: getFacet(14),
  //   ...getSkillDomainAndWeight(getFacet(14)),
  // },
  // {
  //   id: 15,
  //   activity: `Check work for mistakes.`,
  //   facet: getFacet(15),
  //   ...getSkillDomainAndWeight(getFacet(15)),
  // },
  // {
  //   id: 16,
  //   activity: `Find new ways to do things.`,
  //   facet: getFacet(16),
  //   ...getSkillDomainAndWeight(getFacet(16)),
  // },
  // {
  //   id: 17,
  //   activity: `Explain what I am thinking and feeling.`,
  //   facet: getFacet(17),
  //   ...getSkillDomainAndWeight(getFacet(17)),
  // },
  // {
  //   id: 18,
  //   activity: `Do as I'm told.`,
  //   facet: getFacet(18),
  //   ...getSkillDomainAndWeight(getFacet(18)),
  // },
  // {
  //   id: 19,
  //   activity: `Try new things.`,
  //   facet: getFacet(19),
  //   ...getSkillDomainAndWeight(getFacet(19)),
  // },
  // {
  //   id: 20,
  //   activity: `Calm down when I'm feeling angry.`,
  //   facet: getFacet(20),
  //   ...getSkillDomainAndWeight(getFacet(20)),
  // },
  // {
  //   id: 21,
  //   activity: `Have other people rely on me.`,
  //   facet: getFacet(21),
  //   ...getSkillDomainAndWeight(getFacet(21)),
  // },
  // {
  //   id: 22,
  //   activity: `Solve puzzles.`,
  //   facet: getFacet(22),
  //   ...getSkillDomainAndWeight(getFacet(22)),
  // },
  // {
  //   id: 23,
  //   activity: `Work as part of a group.`,
  //   facet: getFacet(23),
  //   ...getSkillDomainAndWeight(getFacet(23)),
  // },
  // {
  //   id: 24,
  //   activity: `Set clear goals.`,
  //   facet: getFacet(24),
  //   ...getSkillDomainAndWeight(getFacet(24)),
  // },
  // {
  //   id: 25,
  //   activity: `Introduce myself to strangers.`,
  //   facet: getFacet(25),
  //   ...getSkillDomainAndWeight(getFacet(25)),
  // },
  // {
  //   id: 26,
  //   activity: `Find things to like about myself.`,
  //   facet: getFacet(26),
  //   ...getSkillDomainAndWeight(getFacet(26)),
  // },
  // {
  //   id: 27,
  //   activity: `Make careful decisions.`,
  //   facet: getFacet(27),
  //   ...getSkillDomainAndWeight(getFacet(27)),
  // },
  // {
  //   id: 28,
  //   activity: `Draw or paint.`,
  //   facet: getFacet(28),
  //   ...getSkillDomainAndWeight(getFacet(28)),
  // },
  // {
  //   id: 29,
  //   activity: `Do what's morally right, even when it's difficult.`,
  //   facet: getFacet(29),
  //   ...getSkillDomainAndWeight(getFacet(29)),
  // },
  // {
  //   id: 30,
  //   activity: `Control my cravings.`,
  //   facet: getFacet(30),
  //   ...getSkillDomainAndWeight(getFacet(30)),
  // },
  // {
  //   id: 31,
  //   activity: `Do things independently.`,
  //   facet: getFacet(31),
  //   ...getSkillDomainAndWeight(getFacet(31)),
  // },
  // {
  //   id: 32,
  //   activity: `Learn about other cultures.`,
  //   facet: getFacet(32),
  //   ...getSkillDomainAndWeight(getFacet(32)),
  // },
  // {
  //   id: 33,
  //   activity: `Make decisions for a group of people.`,
  //   facet: getFacet(33),
  //   ...getSkillDomainAndWeight(getFacet(33)),
  // },
  // {
  //   id: 34,
  //   activity: `Feel compassion for other people.`,
  //   facet: getFacet(34),
  //   ...getSkillDomainAndWeight(getFacet(34)),
  // },
  // {
  //   id: 35,
  //   activity: `Get to appointments on time.`,
  //   facet: getFacet(35),
  //   ...getSkillDomainAndWeight(getFacet(35)),
  // },
  // {
  //   id: 36,
  //   activity: `Have intellectual or philosophical discussions.`,
  //   facet: getFacet(36),
  //   ...getSkillDomainAndWeight(getFacet(36)),
  // },
  // {
  //   id: 37,
  //   activity: `Stop myself from worrying.`,
  //   facet: getFacet(37),
  //   ...getSkillDomainAndWeight(getFacet(37)),
  // },
  // {
  //   id: 38,
  //   activity: `Organize my personal spaces.`,
  //   facet: getFacet(38),
  //   ...getSkillDomainAndWeight(getFacet(38)),
  // },
  // {
  //   id: 39,
  //   activity: `Find the energy to get things done.`,
  //   facet: getFacet(39),
  //   ...getSkillDomainAndWeight(getFacet(39)),
  // },
  // {
  //   id: 40,
  //   activity: `Let people borrow my things.`,
  //   facet: getFacet(40),
  //   ...getSkillDomainAndWeight(getFacet(40)),
  // },
  // {
  //   id: 41,
  //   activity: `Keep doing a task, even if it's boring.`,
  //   facet: getFacet(41),
  //   ...getSkillDomainAndWeight(getFacet(41)),
  // },
  // {
  //   id: 42,
  //   activity: `Understand myself.`,
  //   facet: getFacet(42),
  //   ...getSkillDomainAndWeight(getFacet(42)),
  // },
  // {
  //   id: 43,
  //   activity: `Look on the bright side of things.`,
  //   facet: getFacet(43),
  //   ...getSkillDomainAndWeight(getFacet(43)),
  // },
  // {
  //   id: 44,
  //   activity: `Get started on tasks.`,
  //   facet: getFacet(44),
  //   ...getSkillDomainAndWeight(getFacet(44)),
  // },
  // {
  //   id: 45,
  //   activity: `Confront people when I disagree with them.`,
  //   facet: getFacet(45),
  //   ...getSkillDomainAndWeight(getFacet(45)),
  // },
  // {
  //   id: 46,
  //   activity: `Make people feel comfortable.`,
  //   facet: getFacet(46),
  //   ...getSkillDomainAndWeight(getFacet(46)),
  // },
  // {
  //   id: 47,
  //   activity: `Pay attention to details.`,
  //   facet: getFacet(47),
  //   ...getSkillDomainAndWeight(getFacet(47)),
  // },
  // {
  //   id: 48,
  //   activity: `Put ideas together in a new way.`,
  //   facet: getFacet(48),
  //   ...getSkillDomainAndWeight(getFacet(48)),
  // },
  // {
  //   id: 49,
  //   activity: `Express myself.`,
  //   facet: getFacet(49),
  //   ...getSkillDomainAndWeight(getFacet(49)),
  // },
  // {
  //   id: 50,
  //   activity: `Obey the law.`,
  //   facet: getFacet(50),
  //   ...getSkillDomainAndWeight(getFacet(50)),
  // },
  // {
  //   id: 51,
  //   activity: `Adapt to new surroundings.`,
  //   facet: getFacet(51),
  //   ...getSkillDomainAndWeight(getFacet(51)),
  // },
  // {
  //   id: 52,
  //   activity: `Control my temper.`,
  //   facet: getFacet(52),
  //   ...getSkillDomainAndWeight(getFacet(52)),
  // },
  // {
  //   id: 53,
  //   activity: `Follow through on commitments.`,
  //   facet: getFacet(53),
  //   ...getSkillDomainAndWeight(getFacet(53)),
  // },
  // {
  //   id: 54,
  //   activity: `Handle a lot of information.`,
  //   facet: getFacet(54),
  //   ...getSkillDomainAndWeight(getFacet(54)),
  // },
  // {
  //   id: 55,
  //   activity: `Contribute to group projects.`,
  //   facet: getFacet(55),
  //   ...getSkillDomainAndWeight(getFacet(55)),
  // },
  // {
  //   id: 56,
  //   activity: `Make plans to achieve a goal.`,
  //   facet: getFacet(56),
  //   ...getSkillDomainAndWeight(getFacet(56)),
  // },
  // {
  //   id: 57,
  //   activity: `Meet new people.`,
  //   facet: getFacet(57),
  //   ...getSkillDomainAndWeight(getFacet(57)),
  // },
  // {
  //   id: 58,
  //   activity: `Have confidence in myself.`,
  //   facet: getFacet(58),
  //   ...getSkillDomainAndWeight(getFacet(58)),
  // },
  // {
  //   id: 59,
  //   activity: `Stop and think things through.`,
  //   facet: getFacet(59),
  //   ...getSkillDomainAndWeight(getFacet(59)),
  // },
  // {
  //   id: 60,
  //   activity: `Create art.`,
  //   facet: getFacet(60),
  //   ...getSkillDomainAndWeight(getFacet(60)),
  // },
  // {
  //   id: 61,
  //   activity: `Take responsibility when I've made a mistake.`,
  //   facet: getFacet(61),
  //   ...getSkillDomainAndWeight(getFacet(61)),
  // },
  // {
  //   id: 62,
  //   activity: `Resist temptations.`,
  //   facet: getFacet(62),
  //   ...getSkillDomainAndWeight(getFacet(62)),
  // },
  // {
  //   id: 63,
  //   activity: `Think for myself.`,
  //   facet: getFacet(63),
  //   ...getSkillDomainAndWeight(getFacet(63)),
  // },
  // {
  //   id: 64,
  //   activity: `Understand people from different backgrounds.`,
  //   facet: getFacet(64),
  //   ...getSkillDomainAndWeight(getFacet(64)),
  // },
  // {
  //   id: 65,
  //   activity: `Assert myself as a leader.`,
  //   facet: getFacet(65),
  //   ...getSkillDomainAndWeight(getFacet(65)),
  // },
  // {
  //   id: 66,
  //   activity: `Take another person's perspective.`,
  //   facet: getFacet(66),
  //   ...getSkillDomainAndWeight(getFacet(66)),
  // },
  // {
  //   id: 67,
  //   activity: `Follow a schedule.`,
  //   facet: getFacet(67),
  //   ...getSkillDomainAndWeight(getFacet(67)),
  // },
  // {
  //   id: 68,
  //   activity: `Discuss complicated topics and ideas.`,
  //   facet: getFacet(68),
  //   ...getSkillDomainAndWeight(getFacet(68)),
  // },
  // {
  //   id: 69,
  //   activity: `Cope with stress.`,
  //   facet: getFacet(69),
  //   ...getSkillDomainAndWeight(getFacet(69)),
  // },
  // {
  //   id: 70,
  //   activity: `Keep things neat and tidy.`,
  //   facet: getFacet(70),
  //   ...getSkillDomainAndWeight(getFacet(70)),
  // },
  // {
  //   id: 71,
  //   activity: `Keep going, even when I'm tired.`,
  //   facet: getFacet(71),
  //   ...getSkillDomainAndWeight(getFacet(71)),
  // },
  // {
  //   id: 72,
  //   activity: `See the good in people.`,
  //   facet: getFacet(72),
  //   ...getSkillDomainAndWeight(getFacet(72)),
  // },
  // {
  //   id: 73,
  //   activity: `Follow a consistent routine.`,
  //   facet: getFacet(73),
  //   ...getSkillDomainAndWeight(getFacet(73)),
  // },
  // {
  //   id: 74,
  //   activity: `Understand my emotions.`,
  //   facet: getFacet(74),
  //   ...getSkillDomainAndWeight(getFacet(74)),
  // },
  // {
  //   id: 75,
  //   activity: `Stay in a good mood.`,
  //   facet: getFacet(75),
  //   ...getSkillDomainAndWeight(getFacet(75)),
  // },
  // {
  //   id: 76,
  //   activity: `Focus on my work.`,
  //   facet: getFacet(76),
  //   ...getSkillDomainAndWeight(getFacet(76)),
  // },
  // {
  //   id: 77,
  //   activity: `Change people's minds.`,
  //   facet: getFacet(77),
  //   ...getSkillDomainAndWeight(getFacet(77)),
  // },
  // {
  //   id: 78,
  //   activity: `Get along with people.`,
  //   facet: getFacet(78),
  //   ...getSkillDomainAndWeight(getFacet(78)),
  // },
  // {
  //   id: 79,
  //   activity: `Take care of details.`,
  //   facet: getFacet(79),
  //   ...getSkillDomainAndWeight(getFacet(79)),
  // },
  // {
  //   id: 80,
  //   activity: `Use my imagination.`,
  //   facet: getFacet(80),
  //   ...getSkillDomainAndWeight(getFacet(80)),
  // },
  // {
  //   id: 81,
  //   activity: `Express my thoughts and feelings.`,
  //   facet: getFacet(81),
  //   ...getSkillDomainAndWeight(getFacet(81)),
  // },
  // {
  //   id: 82,
  //   activity: `Follow instructions.`,
  //   facet: getFacet(82),
  //   ...getSkillDomainAndWeight(getFacet(82)),
  // },
  // {
  //   id: 83,
  //   activity: `Adjust to new routines.`,
  //   facet: getFacet(83),
  //   ...getSkillDomainAndWeight(getFacet(83)),
  // },
  // {
  //   id: 84,
  //   activity: `Control my anger.`,
  //   facet: getFacet(84),
  //   ...getSkillDomainAndWeight(getFacet(84)),
  // },
  // {
  //   id: 85,
  //   activity: `Manage my responsibilities.`,
  //   facet: getFacet(85),
  //   ...getSkillDomainAndWeight(getFacet(85)),
  // },
  // {
  //   id: 86,
  //   activity: `Make sense of complex information.`,
  //   facet: getFacet(86),
  //   ...getSkillDomainAndWeight(getFacet(86)),
  // },
  // {
  //   id: 87,
  //   activity: `Work with people toward a shared goal.`,
  //   facet: getFacet(87),
  //   ...getSkillDomainAndWeight(getFacet(87)),
  // },
  // {
  //   id: 88,
  //   activity: `Focus on my most important goals.`,
  //   facet: getFacet(88),
  //   ...getSkillDomainAndWeight(getFacet(88)),
  // },
  // {
  //   id: 89,
  //   activity: `Make conversation with a stranger.`,
  //   facet: getFacet(89),
  //   ...getSkillDomainAndWeight(getFacet(89)),
  // },
  // {
  //   id: 90,
  //   activity: `Find reasons to feel good about myself.`,
  //   facet: getFacet(90),
  //   ...getSkillDomainAndWeight(getFacet(90)),
  // },
  // {
  //   id: 91,
  //   activity: `Weigh pros and cons before making a decision.`,
  //   facet: getFacet(91),
  //   ...getSkillDomainAndWeight(getFacet(91)),
  // },
  // {
  //   id: 92,
  //   activity: `Appreciate art, music, or literature.`,
  //   facet: getFacet(92),
  //   ...getSkillDomainAndWeight(getFacet(92)),
  // },
  // {
  //   id: 93,
  //   activity: `Tell the truth, even when I don't want to.`,
  //   facet: getFacet(93),
  //   ...getSkillDomainAndWeight(getFacet(93)),
  // },
  // {
  //   id: 94,
  //   activity: `Break my bad habits.`,
  //   facet: getFacet(94),
  //   ...getSkillDomainAndWeight(getFacet(94)),
  // },
  // {
  //   id: 95,
  //   activity: `Make decisions on my own.`,
  //   facet: getFacet(95),
  //   ...getSkillDomainAndWeight(getFacet(95)),
  // },
  // {
  //   id: 96,
  //   activity: `Appreciate different cultures.`,
  //   facet: getFacet(96),
  //   ...getSkillDomainAndWeight(getFacet(96)),
  // },
  // {
  //   id: 97,
  //   activity: `Take charge of a situation.`,
  //   facet: getFacet(97),
  //   ...getSkillDomainAndWeight(getFacet(97)),
  // },
  // {
  //   id: 98,
  //   activity: `Respect people's feelings.`,
  //   facet: getFacet(98),
  //   ...getSkillDomainAndWeight(getFacet(98)),
  // },
  // {
  //   id: 99,
  //   activity: `Manage my time.`,
  //   facet: getFacet(99),
  //   ...getSkillDomainAndWeight(getFacet(99)),
  // },
  // {
  //   id: 100,
  //   activity: `Think about the nature of the world.`,
  //   facet: getFacet(100),
  //   ...getSkillDomainAndWeight(getFacet(100)),
  // },
  // {
  //   id: 101,
  //   activity: `Relax when I'm feeling tense.`,
  //   facet: getFacet(101),
  //   ...getSkillDomainAndWeight(getFacet(101)),
  // },
  // {
  //   id: 102,
  //   activity: `Keep things in order.`,
  //   facet: getFacet(102),
  //   ...getSkillDomainAndWeight(getFacet(102)),
  // },
  // {
  //   id: 103,
  //   activity: `Maintain a high energy level.`,
  //   facet: getFacet(103),
  //   ...getSkillDomainAndWeight(getFacet(103)),
  // },
  // {
  //   id: 104,
  //   activity: `Assume the best about people.`,
  //   facet: getFacet(104),
  //   ...getSkillDomainAndWeight(getFacet(104)),
  // },
  // {
  //   id: 105,
  //   activity: `Repeat a standard procedure many times.`,
  //   facet: getFacet(105),
  //   ...getSkillDomainAndWeight(getFacet(105)),
  // },
  // {
  //   id: 106,
  //   activity: `Reflect on my life.`,
  //   facet: getFacet(106),
  //   ...getSkillDomainAndWeight(getFacet(106)),
  // },
  // {
  //   id: 107,
  //   activity: `Stay positive when something bad happens.`,
  //   facet: getFacet(107),
  //   ...getSkillDomainAndWeight(getFacet(107)),
  // },
  // {
  //   id: 108,
  //   activity: `Keep myself from getting distracted.`,
  //   facet: getFacet(108),
  //   ...getSkillDomainAndWeight(getFacet(108)),
  // },
  // {
  //   id: 109,
  //   activity: `Speak up when I disagree with others.`,
  //   facet: getFacet(109),
  //   ...getSkillDomainAndWeight(getFacet(109)),
  // },
  // {
  //   id: 110,
  //   activity: `Make a positive impression on people.`,
  //   facet: getFacet(110),
  //   ...getSkillDomainAndWeight(getFacet(110)),
  // },
  // {
  //   id: 111,
  //   activity: `Find and correct mistakes.`,
  //   facet: getFacet(111),
  //   ...getSkillDomainAndWeight(getFacet(111)),
  // },
  // {
  //   id: 112,
  //   activity: `Come up with creative ideas.`,
  //   facet: getFacet(112),
  //   ...getSkillDomainAndWeight(getFacet(112)),
  // },
  // {
  //   id: 113,
  //   activity: `Tell people how I am feeling.`,
  //   facet: getFacet(113),
  //   ...getSkillDomainAndWeight(getFacet(113)),
  // },
  // {
  //   id: 114,
  //   activity: `Do what I'm supposed to do.`,
  //   facet: getFacet(114),
  //   ...getSkillDomainAndWeight(getFacet(114)),
  // },
  // {
  //   id: 115,
  //   activity: `Step out of my comfort zone.`,
  //   facet: getFacet(115),
  //   ...getSkillDomainAndWeight(getFacet(115)),
  // },
  // {
  //   id: 116,
  //   activity: `Stop myself from getting angry.`,
  //   facet: getFacet(116),
  //   ...getSkillDomainAndWeight(getFacet(116)),
  // },
  // {
  //   id: 117,
  //   activity: `Fulfill my duties and obligations.`,
  //   facet: getFacet(117),
  //   ...getSkillDomainAndWeight(getFacet(117)),
  // },
  // {
  //   id: 118,
  //   activity: `Process new information.`,
  //   facet: getFacet(118),
  //   ...getSkillDomainAndWeight(getFacet(118)),
  // },
  // {
  //   id: 119,
  //   activity: `Collaborate with classmates or coworkers.`,
  //   facet: getFacet(119),
  //   ...getSkillDomainAndWeight(getFacet(119)),
  // },
  // {
  //   id: 120,
  //   activity: `Work hard to succeed.`,
  //   facet: getFacet(120),
  //   ...getSkillDomainAndWeight(getFacet(120)),
  // },
  // {
  //   id: 121,
  //   activity: `Talk to people.`,
  //   facet: getFacet(121),
  //   ...getSkillDomainAndWeight(getFacet(121)),
  // },
  // {
  //   id: 122,
  //   activity: `Respect myself.`,
  //   facet: getFacet(122),
  //   ...getSkillDomainAndWeight(getFacet(122)),
  // },
  // {
  //   id: 123,
  //   activity: `Think before acting.`,
  //   facet: getFacet(123),
  //   ...getSkillDomainAndWeight(getFacet(123)),
  // },
  // {
  //   id: 124,
  //   activity: `Create beautiful things.`,
  //   facet: getFacet(124),
  //   ...getSkillDomainAndWeight(getFacet(124)),
  // },
  // {
  //   id: 125,
  //   activity: `Stop myself from lying or cheating.`,
  //   facet: getFacet(125),
  //   ...getSkillDomainAndWeight(getFacet(125)),
  // },
  // {
  //   id: 126,
  //   activity: `Control my impulses.`,
  //   facet: getFacet(126),
  //   ...getSkillDomainAndWeight(getFacet(126)),
  // },
  // {
  //   id: 127,
  //   activity: `Do things on my own.`,
  //   facet: getFacet(127),
  //   ...getSkillDomainAndWeight(getFacet(127)),
  // },
  // {
  //   id: 128,
  //   activity: `Study other languages or cultures.`,
  //   facet: getFacet(128),
  //   ...getSkillDomainAndWeight(getFacet(128)),
  // },
  // {
  //   id: 129,
  //   activity: `Give a speech.`,
  //   facet: getFacet(129),
  //   ...getSkillDomainAndWeight(getFacet(129)),
  // },
  // {
  //   id: 130,
  //   activity: `Sense other people's needs.`,
  //   facet: getFacet(130),
  //   ...getSkillDomainAndWeight(getFacet(130)),
  // },
  // {
  //   id: 131,
  //   activity: `Organize my schedule.`,
  //   facet: getFacet(131),
  //   ...getSkillDomainAndWeight(getFacet(131)),
  // },
  // {
  //   id: 132,
  //   activity: `Think deeply about things.`,
  //   facet: getFacet(132),
  //   ...getSkillDomainAndWeight(getFacet(132)),
  // },
  // {
  //   id: 133,
  //   activity: `Calm down when I'm feeling anxious.`,
  //   facet: getFacet(133),
  //   ...getSkillDomainAndWeight(getFacet(133)),
  // },
  // {
  //   id: 134,
  //   activity: `Put things back in their proper place.`,
  //   facet: getFacet(134),
  //   ...getSkillDomainAndWeight(getFacet(134)),
  // },
  // {
  //   id: 135,
  //   activity: `Stay active.`,
  //   facet: getFacet(135),
  //   ...getSkillDomainAndWeight(getFacet(135)),
  // },
  // {
  //   id: 136,
  //   activity: `Forgive people quickly.`,
  //   facet: getFacet(136),
  //   ...getSkillDomainAndWeight(getFacet(136)),
  // },
  // {
  //   id: 137,
  //   activity: `Do the same task over and over again.`,
  //   facet: getFacet(137),
  //   ...getSkillDomainAndWeight(getFacet(137)),
  // },
  // {
  //   id: 138,
  //   activity: `Pay attention to my thoughts and feelings.`,
  //   facet: getFacet(138),
  //   ...getSkillDomainAndWeight(getFacet(138)),
  // },
  // {
  //   id: 139,
  //   activity: `Keep a positive attitude.`,
  //   facet: getFacet(139),
  //   ...getSkillDomainAndWeight(getFacet(139)),
  // },
  // {
  //   id: 140,
  //   activity: `Work efficiently, without wasting time.`,
  //   facet: getFacet(140),
  //   ...getSkillDomainAndWeight(getFacet(140)),
  // },
  // {
  //   id: 141,
  //   activity: `Win arguments.`,
  //   facet: getFacet(141),
  //   ...getSkillDomainAndWeight(getFacet(141)),
  // },
  // {
  //   id: 142,
  //   activity: `Show people that I like them.`,
  //   facet: getFacet(142),
  //   ...getSkillDomainAndWeight(getFacet(142)),
  // },
  // {
  //   id: 143,
  //   activity: `Double - check my work.`,
  //   facet: getFacet(143),
  //   ...getSkillDomainAndWeight(getFacet(143)),
  // },
  // {
  //   id: 144,
  //   activity: `Invent things.`,
  //   facet: getFacet(144),
  //   ...getSkillDomainAndWeight(getFacet(144)),
  // },
  // {
  //   id: 145,
  //   activity: `Tell people about my emotions.`,
  //   facet: getFacet(145),
  //   ...getSkillDomainAndWeight(getFacet(145)),
  // },
  // {
  //   id: 146,
  //   activity: `Respect authority.`,
  //   facet: getFacet(146),
  //   ...getSkillDomainAndWeight(getFacet(146)),
  // },
  // {
  //   id: 147,
  //   activity: `Try something that's unfamiliar.`,
  //   facet: getFacet(147),
  //   ...getSkillDomainAndWeight(getFacet(147)),
  // },
  // {
  //   id: 148,
  //   activity: `Stop myself from getting mad.`,
  //   facet: getFacet(148),
  //   ...getSkillDomainAndWeight(getFacet(148)),
  // },
  // {
  //   id: 149,
  //   activity: `Keep track of my promises and commitments.`,
  //   facet: getFacet(149),
  //   ...getSkillDomainAndWeight(getFacet(149)),
  // },
  // {
  //   id: 150,
  //   activity: `Learn things quickly.`,
  //   facet: getFacet(150),
  //   ...getSkillDomainAndWeight(getFacet(150)),
  // },
  // {
  //   id: 151,
  //   activity: `Cooperate to get things done.`,
  //   facet: getFacet(151),
  //   ...getSkillDomainAndWeight(getFacet(151)),
  // },
  // {
  //   id: 152,
  //   activity: `Work toward my goals.`,
  //   facet: getFacet(152),
  //   ...getSkillDomainAndWeight(getFacet(152)),
  // },
  // {
  //   id: 153,
  //   activity: `Start a conversation.`,
  //   facet: getFacet(153),
  //   ...getSkillDomainAndWeight(getFacet(153)),
  // },
  // {
  //   id: 154,
  //   activity: `See my strengths.`,
  //   facet: getFacet(154),
  //   ...getSkillDomainAndWeight(getFacet(154)),
  // },
  // {
  //   id: 155,
  //   activity: `Think things through carefully.`,
  //   facet: getFacet(155),
  //   ...getSkillDomainAndWeight(getFacet(155)),
  // },
  // {
  //   id: 156,
  //   activity: `Make music.`,
  //   facet: getFacet(156),
  //   ...getSkillDomainAndWeight(getFacet(156)),
  // },
  // {
  //   id: 157,
  //   activity: `Follow my ethical principles.`,
  //   facet: getFacet(157),
  //   ...getSkillDomainAndWeight(getFacet(157)),
  // },
  // {
  //   id: 158,
  //   activity: `Stop myself from acting on impulse.`,
  //   facet: getFacet(158),
  //   ...getSkillDomainAndWeight(getFacet(158)),
  // },
  // {
  //   id: 159,
  //   activity: `Make my own choices.`,
  //   facet: getFacet(159),
  //   ...getSkillDomainAndWeight(getFacet(159)),
  // },
  // {
  //   id: 160,
  //   activity: `Understand people's cultural identities.`,
  //   facet: getFacet(160),
  //   ...getSkillDomainAndWeight(getFacet(160)),
  // },
  // {
  //   id: 161,
  //   activity: `Convince people to follow my lead.`,
  //   facet: getFacet(161),
  //   ...getSkillDomainAndWeight(getFacet(161)),
  // },
  // {
  //   id: 162,
  //   activity: `Understand how other people feel.`,
  //   facet: getFacet(162),
  //   ...getSkillDomainAndWeight(getFacet(162)),
  // },
  // {
  //   id: 163,
  //   activity: `Plan out my time.`,
  //   facet: getFacet(163),
  //   ...getSkillDomainAndWeight(getFacet(163)),
  // },
  // {
  //   id: 164,
  //   activity: `Feel curious about ideas.`,
  //   facet: getFacet(164),
  //   ...getSkillDomainAndWeight(getFacet(164)),
  // },
  // {
  //   id: 165,
  //   activity: `Settle down when I'm feeling nervous.`,
  //   facet: getFacet(165),
  //   ...getSkillDomainAndWeight(getFacet(165)),
  // },
  // {
  //   id: 166,
  //   activity: `Clean up after making a mess.`,
  //   facet: getFacet(166),
  //   ...getSkillDomainAndWeight(getFacet(166)),
  // },
  // {
  //   id: 167,
  //   activity: `Keep myself motivated.`,
  //   facet: getFacet(167),
  //   ...getSkillDomainAndWeight(getFacet(167)),
  // },
  // {
  //   id: 168,
  //   activity: `Trust people.`,
  //   facet: getFacet(168),
  //   ...getSkillDomainAndWeight(getFacet(168)),
  // },
  // {
  //   id: 169,
  //   activity: `Do tasks that are routine or repetitive.`,
  //   facet: getFacet(169),
  //   ...getSkillDomainAndWeight(getFacet(169)),
  // },
  // {
  //   id: 170,
  //   activity: `Examine myself and my life.`,
  //   facet: getFacet(170),
  //   ...getSkillDomainAndWeight(getFacet(170)),
  // },
  // {
  //   id: 171,
  //   activity: `Stay optimistic when things go wrong.`,
  //   facet: getFacet(171),
  //   ...getSkillDomainAndWeight(getFacet(171)),
  // },
  // {
  //   id: 172,
  //   activity: `Concentrate on a task.`,
  //   facet: getFacet(172),
  //   ...getSkillDomainAndWeight(getFacet(172)),
  // },
  // {
  //   id: 173,
  //   activity: `Be blunt and direct with people.`,
  //   facet: getFacet(173),
  //   ...getSkillDomainAndWeight(getFacet(173)),
  // },
  // {
  //   id: 174,
  //   activity: `Put people at ease.`,
  //   facet: getFacet(174),
  //   ...getSkillDomainAndWeight(getFacet(174)),
  // },
  // {
  //   id: 175,
  //   activity: `Pay careful attention to my work.`,
  //   facet: getFacet(175),
  //   ...getSkillDomainAndWeight(getFacet(175)),
  // },
  // {
  //   id: 176,
  //   activity: `Come up with new ideas.`,
  //   facet: getFacet(176),
  //   ...getSkillDomainAndWeight(getFacet(176)),
  // },
  // {
  //   id: 177,
  //   activity: `Explain what's on my mind.`,
  //   facet: getFacet(177),
  //   ...getSkillDomainAndWeight(getFacet(177)),
  // },
  // {
  //   id: 178,
  //   activity: `Follow the rules.`,
  //   facet: getFacet(178),
  //   ...getSkillDomainAndWeight(getFacet(178)),
  // },
  // {
  //   id: 179,
  //   activity: `Adapt to change.`,
  //   facet: getFacet(179),
  //   ...getSkillDomainAndWeight(getFacet(179)),
  // },
  // {
  //   id: 180,
  //   activity: `Settle down when I'm feeling annoyed.`,
  //   facet: getFacet(180),
  //   ...getSkillDomainAndWeight(getFacet(180)),
  // },
  // {
  //   id: 181,
  //   activity: `Follow through on promises.`,
  //   facet: getFacet(181),
  //   ...getSkillDomainAndWeight(getFacet(181)),
  // },
  // {
  //   id: 182,
  //   activity: `Find logical solutions to problems.`,
  //   facet: getFacet(182),
  //   ...getSkillDomainAndWeight(getFacet(182)),
  // },
  // {
  //   id: 183,
  //   activity: `Cooperate with other people.`,
  //   facet: getFacet(183),
  //   ...getSkillDomainAndWeight(getFacet(183)),
  // },
  // {
  //   id: 184,
  //   activity: `Set high standards for myself.`,
  //   facet: getFacet(184),
  //   ...getSkillDomainAndWeight(getFacet(184)),
  // },
  // {
  //   id: 185,
  //   activity: `Talk to classmates or coworkers.`,
  //   facet: getFacet(185),
  //   ...getSkillDomainAndWeight(getFacet(185)),
  // },
  // {
  //   id: 186,
  //   activity: `See my good qualities.`,
  //   facet: getFacet(186),
  //   ...getSkillDomainAndWeight(getFacet(186)),
  // },
  // {
  //   id: 187,
  //   activity: `Consider the consequences of my decisions.`,
  //   facet: getFacet(187),
  //   ...getSkillDomainAndWeight(getFacet(187)),
  // },
  // {
  //   id: 188,
  //   activity: `Write stories or poems.`,
  //   facet: getFacet(188),
  //   ...getSkillDomainAndWeight(getFacet(188)),
  // },
  // {
  //   id: 189,
  //   activity: `Be honest with people.`,
  //   facet: getFacet(189),
  //   ...getSkillDomainAndWeight(getFacet(189)),
  // },
  // {
  //   id: 190,
  //   activity: `Avoid temptation.`,
  //   facet: getFacet(190),
  //   ...getSkillDomainAndWeight(getFacet(190)),
  // },
  // {
  //   id: 191,
  //   activity: `Get things done by myself.`,
  //   facet: getFacet(191),
  //   ...getSkillDomainAndWeight(getFacet(191)),
  // },
  // {
  //   id: 192,
  //   activity: `Get along with people from different backgrounds.`,
  //   facet: getFacet(192),
  //   ...getSkillDomainAndWeight(getFacet(192)),
  // },
]