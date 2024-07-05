// Dummy data
import { DUMMY_BESSI_USER_SCORES } from '@/components/DataViz/BarChart/PerDomain/dummy-data'
// Utility functions
import { getRandomValueInRange } from '@/utils/misc'
import {
  getFacet,
  calculateBessiScores,
  getSkillDomainAndWeight,
} from '../utils'
// Types
import { BessiActivityType, UserScoresType } from '../types'
// Enums
import { Facet, SkillDomain } from '../enums'


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

export const WELLNESS_RATINGS = [1, 2, 3, 4, 5]
export const WELLNESS_RATINGS_DESCRIPTIONS = [
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



export function getDummyPopulationBessiScores(
  n: number, 
  domainOrFacet: 'facet' | 'domain'
): { [key: string]: number[] } {
  let keys: string[] = []

  const dummyBessiUserScores = calculateBessiScores(DUMMY_BESSI_USER_SCORES as UserScoresType[])

  if (domainOrFacet === 'domain') {
    keys = Object.keys(dummyBessiUserScores.domainScores)
  } else if (domainOrFacet === 'facet') {
    keys = Object.keys(dummyBessiUserScores.facetScores)
  } else {
    const error = 'Could not get dummy population scores because did not specify whether output is for facet or domain.'
    throw new Error(error)
  }

  let populationScores: { [key: string]: number[] } = {}

  for (let i = 0; i < n; i++) {
    // For each domain name
    keys.forEach((key: string) => {
      // Push the user's score to the array of scores for this key.
      const value = getRandomValueInRange(0, 100)
      const values = populationScores[key] 
        ? [ ...populationScores[key], value ] 
        : [ value ]

      populationScores[key] = values
    })
  }

  return populationScores
}



// Mappings
export const FACET_MAPPING: { [key: number]: Facet } = {
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

export const DOMAIN_TO_FACET_MAPPING = {
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


/**
 * @dev Taken from [`BESSI_32_Facet_Feedback_6_29_21`](https://uillinoisedu-my.sharepoint.com/:w:/r/personal/jlmaldo2_illinois_edu/_layouts/15/Doc.aspx?sourcedoc=%7BAF5B5349-569D-4B82-9252-828BFD326F01%7D&file=BESSI_32_Facet_Feedback_6_29_21.docx&action=default&mobileredirect=true)
 * 
 */
export const FACET_FEEDBACK = {
  'GoalRegulation': {
    'top-third': 'Compared to others, you scored in the top third of the distribution for goal regulation. This means you feel confident that you have the capacity to focus on your most important goals, make plans and set clear goals, and then set high standards and work effectively toward them.',
    'middle': 'Compared to others you scored in the middle of the distribution of goal regulation. This means you feel fairly confident in your ability to focus on your most important goals, make plans and set clear goals, and then set high standards and work effectively toward them. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of goal regulation. This means that you do not feel as confident as others in your ability to focus on your most important goals, make plans, set clear goals, and then set high standards and work effectively toward them. This indicates that you see room for improvement in this domain.',
  },
  'TaskManagement': {
    'top-third': 'Compared to others you scored in the top third of the distribution of task management. This means that you feel confident in your ability to start tasks, concentrate on those tasks and not get distracted, and focus on the task until it is completed.',
    'middle': 'Compared to others you scored in the middle of the distribution of task management. This means that you feel fairly confident in your ability to start tasks, concentrate on those tasks and not get distracted, and focus on the task until it is completed. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of task management. This means that you do not feel confident as others in your ability to start tasks, concentrate on those tasks and not get distracted, and focus on the task until it is completed.',
  },
  'DecisionMakingSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of decision-making. This means that you feel confident in your ability to stop and think through decisions, to think carefully before acting, and weigh the pros and cons of the decisions that you make.',
    'middle': 'Compared to others you scored in the middle of the distribution of decision-making. This means that you feel fairly confident in your ability to stop and think through decisions, to think carefully before acting, and weigh the pros and cons of the decisions that you make. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of decision making. This means that you do not feel confident in your ability to stop and think through decisions, to think carefully before acting, and weigh the pros and cons of the decisions that you make. Your score indicates that you see room for improvement in this domain.',
  },
  'DetailManagement': {
    'top-third': 'Compared to others you scored in the top third of the distribution of detail management. This means that you feel confident in your ability to find and correct mistakes in your work, pay attention to details, and double-check your work.',
    'middle': 'Compared to others you scored in the middle of the distribution of detail management. This means that you feel fairly confident in your ability to find and correct mistakes in your work, pay attention to details, and double-check your work. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of detail management. This means that you do not feel confident in your ability to find and correct mistakes in your work, pay attention to details, and double-check your work. Your score indicates that you see room for improvement in this domain.',
  },
  'CapacityForConsistency': {
    'top-third': 'Compared to others you scored in the top third of the distribution of capacity for consistency. This means you feel confident in your ability to handle routine or repetitive work, that you can do the same task over and over again without fail, and that you tolerate repetition and routine even when it is boring.',
    'middle': 'Compared to others you scored in the middle of the distribution of capacity for consistency. This means you feel fairly confident in your ability to handle routine or repetitive work, that you can do the same task over and over again without fail, and that you tolerate repetition and routine even when it is boring. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of capacity for consistency. This means you do not feel confident in your ability to handle routine or repetitive work, that you can do the same task over and over again without fail, and that you tolerate repetition and routine even when it is boring. Your score indicates that you see room for improvement in this domain.',
  },
  'OrganizationalSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of organizational skill. This means you feel confident in your ability to keep things in order, organize your personal spaces, clean up after yourself, and put things back in their proper place.',
    'middle': 'Compared to others you scored in the middle of the distribution of organizational skill. This means you feel fairly confident in your ability to keep things in order, organize your personal spaces, clean up after yourself, and put things back in their proper place. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of organizational skill. This means you do not feel confident in your ability to keep things in order, organize your personal spaces, clean up after yourself, and put things back in their proper place. Your score indicates that you see room for improvement in this domain.',
  },
  'TimeManagement': {
    'top-third': 'Compared to others you scored in the top third of the distribution of time management. This means you feel confident in your ability to organize your schedule, plan out your time, follow a schedule once you set it, and show up to things on time.',
    'middle': 'Compared to others you scored in the middle of the distribution of time management. This means you feel fairly confident in your ability to organize your schedule, plan out your time, follow a schedule once you set it, and show up to things on time. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of time management. This means you do not feel confident in your ability to organize your schedule, plan out your time, follow a schedule once you set it, and show up to things on time. Your score indicates that you see room for improvement in this domain.',
  },
  'ResponsibilityManagement': {
    'top-third': 'Compared to others you scored in the top third of the distribution of responsibility management. This means you feel confident in your ability to make and keep promises, follow through with your commitments, manage your responsibilities and obligations, and have other people rely on you.',
    'middle': 'Compared to others you scored in the middle of the distribution of responsibility management. This means you feel fairly confident in your ability to make and keep promises, follow through with your commitments, manage your responsibilities and obligations, and have other people rely on you. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of responsibility management. This means you do not feel confident in your ability to make and keep promises, follow through with your commitments, manage your responsibilities and obligations, and have other people rely on you. Your score indicates that you see room for improvement in this domain.',
  },
  'RuleFollowingSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of rule-following skill. This means that you feel confident in your ability to follow instructions, to do as you are told, respect authority, and obey the law.',
    'middle': 'Compared to others you scored in the middle of the distribution of rule-following skill. This means that you feel confident in your ability to follow instructions, to do as you are told, respect authority, and obey the law. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of rule-following skill. This means that you do not feel confident in your ability to follow instructions, to do as you are told, respect authority, and obey the law. Your score indicates that you see room for improvement in this domain.',
  },
  'AbstractThinkingSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of abstract thinking skill. This means you feel confident in your ability to think deeply about ideas, understand abstract ideas, discuss complicated topics, and have intellectual or philosophical discussions.',
    'middle': 'Compared to others you scored in the middle of the distribution of abstract thinking skill. This means you feel fairly confident in your ability to think deeply about ideas, understand abstract ideas, discuss complicated topics, and have intellectual or philosophical discussions. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of abstract thinking skill. This means you do not feel confident in your ability to think deeply about ideas, understand abstract ideas, discuss complicated topics, and have intellectual or philosophical discussions. Your score indicates that you see room for improvement in this domain.',
  },
  'CreativeSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of creative skill. This means you feel confident in your ability to come up with new and creative ideas, invent things, find new ways of doing things, and using your imagination.',
    'middle': 'Compared to others you scored in the middle of the distribution of creative skill. This means you feel fairly confident in your ability to come up with new and creative ideas, invent things, find new ways of doing things, and using your imagination. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of creative skill. This means you do not feel confident in your ability to come up with new and creative ideas, invent things, find new ways of doing things, and using your imagination. Your score indicates that you see room for improvement in this domain.',
  },
  'InformationProcessingSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of information processing skill. This means you feel confident in your ability to process new information, make sense of complex information, learn things quickly, solve puzzles, and find logical solutions to problems.',
    'middle': 'Compared to others you scored in the middle of the distribution of information processing skill. This means you feel fairly confident in your ability to process new information, make sense of complex information, learn things quickly, solve puzzles, and find logical solutions to problems. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of information processing skill. This means you do not feel confident in your ability to process new information, make sense of complex information, learn things quickly, solve puzzles, and find logical solutions to problems. Your score indicates that you see room for improvement in this domain.',
  },
  'CulturalCompetence': {
    'top-third': 'Compared to others you scored in the top third of the distribution of cultural competence. This means you feel confident in your ability to appreciate and learn things from different cultures, study other languages or cultures, and understand people from different backgrounds.',
    'middle': 'Compared to others you scored in the middle of the distribution of cultural competence. This means you feel fairly confident in your ability to appreciate and learn things from different cultures, study other languages or cultures, and understand people from different backgrounds. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of cultural competence. This means you do not feel confident in your ability to appreciate and learn things from different cultures, study other languages or cultures, and understand people from different backgrounds. Your score indicates that you see room for improvement in this domain.',
  },
  'ArtisticSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of artistic skill. This means you feel confident in your ability to appreciate, art, music, or literature, and to create beautiful things through drawing, painting, playing instruments, or writing.',
    'middle': 'Compared to others you scored in the middle of the distribution of artistic skill. This means you feel fairly confident in your ability to appreciate, art, music, or literature, and to create beautiful things through drawing, painting, playing instruments, or writing. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of artistic skill. This means you do not feel confident in your ability to appreciate, art, music, or literature, and to create beautiful things through drawing, painting, playing instruments, or writing. Your score indicates that you see room for improvement in this domain.',
  },
  'SelfReflectionSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of self-reflection skill. This means you feel confident in your ability to pay attention to your thoughts and feelings, reflect on your life, look inside yourself, and understand your emotions.',
    'middle': 'Compared to others you scored in the middle of the distribution of self-reflection skill. This means you feel fairly confident in your ability to pay attention to your thoughts and feelings, reflect on your life, look inside yourself, and understand your emotions. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of self-reflection skill. This means you do not feel confident in your ability to pay attention to your thoughts and feelings, reflect on your life, look inside yourself, and understand your emotions. Your score indicates that you see room for improvement in this domain.',
  },
  'CapacityForIndependence': {
    'top-third': 'Compared to others you scored in the top third of the distribution of capacity for independence. This means you feel confident in your ability to do things on your own, make your own decisions, think for yourself, and get things done by yourself.',
    'middle': 'Compared to others you scored in the middle of the distribution of capacity for independence. This means you feel fairly confident in your ability to do things on your own, make your own decisions, think for yourself, and get things done by yourself. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of capacity for independence. This means you do not feel confident in your ability to do things on your own, make your own decisions, think for yourself, and get things done by yourself. Your score indicates that you see room for improvement in this domain.',
  },
  'PerspectiveTakingSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of perspective-taking skill. This means that you feel confident in your ability to take another person’s perspective, understand how they feel, respect their feelings, and feel compassion for them.',
    'middle': 'Compared to others you scored in the middle of the distribution of perspective-taking skill. This means that you feel fairly confident in your ability to take another person’s perspective, understand how they feel, respect their feelings, and feel compassion for them. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of perspective-taking skill. This means that you do not feel confident in your ability to take another person’s perspective, understand how they feel, respect their feelings, and feel compassion for them. Your score indicates that you see room for improvement in this domain.',
  },
  'CapacityforSocialWarmth': {
    'top-third': 'Compared to others you scored in the top third of the distribution of capacity for social warmth. This means that you feel confident in your ability to get along with people, put them at ease, make a positive impression and make them feel comfortable.',
    'middle': 'Compared to others you scored in the middle of the distribution of capacity for social warmth. This means that you feel fairly confident in your ability to get along with people, put them at ease, make a positive impression and make them feel comfortable. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of capacity for social warmth. This means that you do not feel confident in your ability to get along with people, put them at ease, make a positive impression and make them feel comfortable. Your score indicates that you see room for improvement in this domain.',
  },
  'TeamworkSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of teamwork skill. This means you feel confident in your ability to collaborate and cooperate with others, work as part of a group, contribute to group projects, and get things done in a group.',
    'middle': 'Compared to others you scored in the middle of the distribution of teamwork skill. This means you feel fairly confident in your ability to collaborate and cooperate with others, work as part of a group, contribute to group projects, and get things done in a group. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of teamwork skill. This means you do not feel confident in your ability to collaborate and cooperate with others, work as part of a group, contribute to group projects, and get things done in a group. Your score indicates that you see room for improvement in this domain.',
  },
  'EthicalCompetence': {
    'top-third': 'Compared to others you scored in the top third of the distribution of ethical competence. This means that you feel confident in your ability to follow ethical principles, avoid lying and cheating, tell the truth, and take responsibility for your mistakes.',
    'middle': 'Compared to others you scored in the middle of the distribution of ethical competence. This means that you feel fairly confident in your ability to follow ethical principles, avoid lying and cheating, tell the truth, and take responsibility for your mistakes. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of ethical competence. This means that you do not feel confident in your ability to follow ethical principles, avoid lying and cheating, tell the truth, and take responsibility for your mistakes. Your score indicates that you see room for improvement in this domain.',
  },
  'CapacityForTrust': {
    'top-third': 'Compared to others you scored in the top third of the distribution of capacity for trust. This means that you feel confident in your ability to trust people, forgive them quickly, let go of grudges, and assume the best about people.',
    'middle': 'Compared to others you scored in the middle of the distribution of capacity for trust. This means that you feel fairly confident in your ability to trust people, forgive them quickly, let go of grudges, and assume the best about people. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of capacity for trust. This means that you do not feel confident in your ability to trust people, forgive them quickly, let go of grudges, and assume the best about people. Your score indicates that you see room for improvement in this domain.',
  },
  'LeadershipSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of leadership skill. This means that you feel confident in your ability to give a speech, take charge of a situation, convince people to follow your lead, assert yourself as a leader, and make decisions for people.',
    'middle': 'Compared to others you scored in the middle of the distribution of leadership skill. This means that you feel fairly confident in your ability to give a speech, take charge of a situation, convince people to follow your lead, assert yourself as a leader, and make decisions for people. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of leadership skill. This means that you do not feel confident in your ability to give a speech, take charge of a situation, convince people to follow your lead, assert yourself as a leader, and make decisions for people. Your score indicates that you see room for improvement in this domain.',
  },
  'ExpressiveSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of expressive skill. This means that you feel confident in your ability to express your thoughts and feelings, explain what you are thinking, and tell people how you are feeling.',
    'middle': 'Compared to others you scored in the middle of the distribution of expressive skill. This means that you feel fairly confident in your ability to express your thoughts and feelings, explain what you are thinking, and tell people how you are feeling. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of expressive skill. This means that you do not feel confident in your ability to express your thoughts and feelings, explain what you are thinking, and tell people how you are feeling. Your score indicates that you see room for improvement in this domain.',
  },
  'ConversationSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of conversation skill. This means that you are confident in your ability to meet new people, start a conversation, talk to strangers, and keep a conversation going.',
    'middle': 'Compared to others you scored in the middle of the distribution of conversation skill. This means that you feel fairly confident in your ability to meet new people, start a conversation, talk to strangers, and keep a conversation going. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of conversation skill. This means that you do not feel confident in your ability to meet new people, start a conversation, talk to strangers, and keep a conversation going. Your score indicates that you see room for improvement in this domain.',
  },
  'PersuasiveSkill': {
    'top-third': 'Compared to others you scored in the top third of the distribution of persuasive skill. This means that you feel confident in your ability to be direct with people, confront and speak up to people you disagree with, and win arguments and debates with other people.',
    'middle': 'Compared to others you scored in the middle of the distribution of persuasive skill. This means that you feel fairly confident in your ability to be direct with people, confront and speak up to people you disagree with, and win arguments and debates with other people. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of persuasive skill. This means that you do not feel confident in your ability to be direct with people, confront and speak up to people you disagree with, and win arguments and debates with other people. Your score indicates that you see room for improvement in this domain.',
  },
  'EnergyRegulation': {
    'top-third': 'Compared to others you scored in the top third of the distribution of energy regulation. This means that you feel confident in your ability to find the energy to get things done, stay active and motivated, use your energy in productive ways, and keep going even when you are tired.',
    'middle': 'Compared to others you scored in the middle of the distribution of energy regulation. This means that you feel fairly confident in your ability to find the energy to get things done, stay active and motivated, use your energy in productive ways, and keep going even when you are tired. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of energy regulation. This means that you do not feel confident in your ability to find the energy to get things done, stay active and motivated, use your energy in productive ways, and keep going even when you are tired. Your score indicates that you see room for improvement in this domain.',
  },
  'StressRegulation': {
    'top-third': 'Compared to others you scored in the top third of the distribution of stress regulation. This means that you feel confident in your ability to stay calm in stressful situations, settle down when you do feel nervous, stop yourself from worrying, and cope effectively with stress.',
    'middle': 'Compared to others you scored in the middle of the distribution of stress regulation. This means that you feel fairly confident in your ability to stay calm in stressful situations, settle down when you do feel nervous, stop yourself from worrying, and cope effectively with stress. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of stress regulation. This means that you do not feel confident in your ability to stay calm in stressful situations, settle down when you do feel nervous, stop yourself from worrying, and cope effectively with stress. Your score indicates that you see room for improvement in this domain.',
  },
  'CapacityForOptimism': {
    'top-third': 'Compared to others you scored in the top third of the distribution of capacity for optimism. This means that you feel confident in your ability to keep a positive attitude, stay positive when something bad happens, and stay in a good mood.',
    'middle': 'Compared to others you scored in the middle of the distribution of capacity for optimism. This means that you feel fairly confident in your ability to keep a positive attitude, stay positive when something bad happens, and stay in a good mood. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of capacity for optimism. This means that you do not feel confident in your ability to keep a positive attitude, stay positive when something bad happens, and stay in a good mood. Your score indicates that you see room for improvement in this domain.',
  },
  'ConfidenceRegulation': {
    'top-third': 'Compared to others you scored in the top third of the distribution of confidence regulation. This means that you feel confident in your ability to see your good qualities and your strengths, find things to like about yourself, have confidence in yourself, and respect yourself.',
    'middle': 'Compared to others you scored in the middle of the distribution of confidence regulation. This means that you feel fairly confident in your ability to see your good qualities and your strengths, find things to like about yourself, have confidence in yourself, and respect yourself. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of confidence regulation. This means that you do not feel confident in your ability to see your good qualities and your strengths, find things to like about yourself, have confidence in yourself, and respect yourself. Your score indicates that you see room for improvement in this domain.',
  },
  'ImpulseRegulation': {
    'top-third': 'Compared to others you scored in the top third of the distribution of impulse regulation. This means that you feel confident in your ability to avoid and resist temptation, control your cravings, stop yourself from acting on impulse, and break your bad habits.',
    'middle': 'Compared to others you scored in the middle of the distribution of impulse regulation. This means that you feel fairly confident in your ability to avoid and resist temptation, control your cravings, stop yourself from acting on impulse, and break your bad habits. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of impulse regulation. This means that you do not feel confident in your ability to avoid and resist temptation, control your cravings, stop yourself from acting on impulse, and break your bad habits. Your score indicates that you see room for improvement in this domain.',
  },
  'AngerManagement': {
    'top-third': 'Compared to others you scored in the top third of the distribution of anger management. This means that you feel confident in your ability to stop yourself from getting mad, control your anger, and settle down when you are feeling angry.',
    'middle': 'Compared to others you scored in the middle of the distribution of anger management. This means that you feel fairly confident in your ability to stop yourself from getting mad, control your anger, and settle down when you are feeling angry. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of anger management. This means that you do not feel confident in your ability to stop yourself from getting mad, control your anger, and settle down when you are feeling angry. Your score indicates that you see room for improvement in this domain.',
  },
  'Adaptability': {
    'top-third': 'Compared to others you scored in the top third of the distribution of adaptability. This means that you feel confident in your ability to try new things, adapt to new surroundings, adjust to new routines, and adapt to change.',
    'middle': 'Compared to others you scored in the middle of the distribution of adaptability. This means that you feel fairly confident in your ability to try new things, adapt to new surroundings, adjust to new routines, and adapt to change. Your score indicates that you see room for improvement in this domain.',
    'bottom-third': 'Compared to others you scored in the bottom third of the distribution of adaptability. This means that you do not feel confident in your ability to try new things, adapt to new surroundings, adjust to new routines, and adapt to change. Your score indicates that you see room for improvement in this domain.',
  },
}


export const SKILLS_DOMAIN_MAPPING: { [key: string]: { domain: SkillDomain[], weight: number } } = {
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



export const SKILLS_MAPPING = {
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




export const BESSI_ACTIVITIES: string[] = [
  `Lead a group of people.`,
  `Sympathize with other people's feelings.`,
  `Show up for things on time.`,
  `Understand abstract ideas.`,
  `Stay calm in stressful situations.`,
  `Tidy up after myself.`,
  `Use my energy in productive ways.`,
  `Let go of a grudge.`,
  `Repeat a task consistently.`,
  `Look inside myself.`,
  `Stop myself from feeling pessimistic.`,
  `Keep working until a task is finished.`,
  `Win debates with other people.`,
  `Make people smile.`,
  `Check work for mistakes.`,
  `Find new ways to do things.`,
  `Explain what I am thinking and feeling.`,
  `Do as I'm told.`,
  `Try new things.`,
  `Calm down when I'm feeling angry.`,
  `Have other people rely on me.`,
  `Solve puzzles.`,
  `Work as part of a group.`,
  `Set clear goals.`,
  `Introduce myself to strangers.`,
  `Find things to like about myself.`,
  `Make careful decisions.`,
  `Draw or paint.`,
  `Do what's morally right, even when it's difficult.`,
  `Control my cravings.`,
  `Do things independently.`,
  `Learn about other cultures.`,
  `Make decisions for a group of people.`,
  `Feel compassion for other people.`,
  `Get to appointments on time.`,
  `Have intellectual or philosophical discussions.`,
  `Stop myself from worrying.`,
  `Organize my personal spaces.`,
  `Find the energy to get things done.`,
  `Let people borrow my things.`,
  `Keep doing a task, even if it's boring.`,
  `Understand myself.`,
  `Look on the bright side of things.`,
  `Get started on tasks.`,
  `Confront people when I disagree with them.`,
  `Make people feel comfortable.`,
  `Pay attention to details.`,
  `Put ideas together in a new way.`,
  `Express myself.`,
  `Obey the law.`,
  `Adapt to new surroundings.`,
  `Control my temper.`,
  `Follow through on commitments.`,
  `Handle a lot of information.`,
  `Contribute to group projects.`,
  `Make plans to achieve a goal.`,
  `Meet new people.`,
  `Have confidence in myself.`,
  `Stop and think things through.`,
  `Create art.`,
  `Take responsibility when I've made a mistake.`,
  `Resist temptations.`,
  `Think for myself.`,
  `Understand people from different backgrounds.`,
  `Assert myself as a leader.`,
  `Take another person's perspective.`,
  `Follow a schedule.`,
  `Discuss complicated topics and ideas.`,
  `Cope with stress.`,
  `Keep things neat and tidy.`,
  `Keep going, even when I'm tired.`,
  `See the good in people.`,
  `Follow a consistent routine.`,
  `Understand my emotions.`,
  `Stay in a good mood.`,
  `Focus on my work.`,
  `Change people's minds.`,
  `Get along with people.`,
  `Take care of details.`,
  `Use my imagination.`,
  `Express my thoughts and feelings.`,
  `Follow instructions.`,
  `Adjust to new routines.`,
  `Control my anger.`,
  `Manage my responsibilities.`,
  `Make sense of complex information.`,
  `Work with people toward a shared goal.`,
  `Focus on my most important goals.`,
  `Make conversation with a stranger.`,
  `Find reasons to feel good about myself.`,
  `Weigh pros and cons before making a decision.`,
  `Appreciate art, music, or literature.`,
  `Tell the truth, even when I don't want to.`,
  `Break my bad habits.`,
  `Make decisions on my own.`,
  `Appreciate different cultures.`,
  `Take charge of a situation.`,
  `Respect people's feelings.`,
  `Manage my time.`,
  `Think about the nature of the world.`,
  `Relax when I'm feeling tense.`,
  `Keep things in order.`,
  `Maintain a high energy level.`,
  `Assume the best about people.`,
  `Repeat a standard procedure many times.`,
  `Reflect on my life.`,
  `Stay positive when something bad happens.`,
  `Keep myself from getting distracted.`,
  `Speak up when I disagree with others.`,
  `Make a positive impression on people.`,
  `Find and correct mistakes.`,
  `Come up with creative ideas.`,
  `Tell people how I am feeling.`,
  `Do what I'm supposed to do.`,
  `Step out of my comfort zone.`,
  `Stop myself from getting angry.`,
  `Fulfill my duties and obligations.`,
  `Process new information.`,
  `Collaborate with classmates or coworkers.`,
  `Work hard to succeed.`,
  `Talk to people.`,
  `Respect myself.`,
  `Think before acting.`,
  `Create beautiful things.`,
  `Stop myself from lying or cheating.`,
  `Control my impulses.`,
  `Do things on my own.`,
  `Study other languages or cultures.`,
  `Give a speech.`,
  `Sense other people's needs.`,
  `Organize my schedule.`,
  `Think deeply about things.`,
  `Calm down when I'm feeling anxious.`,
  `Put things back in their proper place.`,
  `Stay active.`,
  `Forgive people quickly.`,
  `Do the same task over and over again.`,
  `Pay attention to my thoughts and feelings.`,
  `Keep a positive attitude.`,
  `Work efficiently, without wasting time.`,
  `Win arguments.`,
  `Show people that I like them.`,
  `Double-check my work.`,
  `Invent things.`,
  `Tell people about my emotions.`,
  `Respect authority.`,
  `Try something that's unfamiliar.`,
  `Stop myself from getting mad.`,
  `Keep track of my promises and commitments.`,
  `Learn things quickly.`,
  `Cooperate to get things done.`,
  `Work toward my goals.`,
  `Start a conversation.`,
  `See my strengths.`,
  `Think things through carefully.`,
  `Make music.`,
  `Follow my ethical principles.`,
  `Stop myself from acting on impulse.`,
  `Make my own choices.`,
  `Understand people's cultural identities.`,
  `Convince people to follow my lead.`,
  `Understand how other people feel.`,
  `Plan out my time.`,
  `Feel curious about ideas.`,
  `Settle down when I'm feeling nervous.`,
  `Clean up after making a mess.`,
  `Keep myself motivated.`,
  `Trust people.`,
  `Do tasks that are routine or repetitive.`,
  `Examine myself and my life.`,
  `Stay optimistic when things go wrong.`,
  `Concentrate on a task.`,
  `Be blunt and direct with people.`,
  `Put people at ease.`,
  `Pay careful attention to my work.`,
  `Come up with new ideas.`,
  `Explain what's on my mind.`,
  `Follow the rules.`,
  `Adapt to change.`,
  `Settle down when I'm feeling annoyed.`,
  `Follow through on promises.`,
  `Find logical solutions to problems.`,
  `Cooperate with other people.`,
  `Set high standards for myself.`,
  `Talk to classmates or coworkers.`,
  `See my good qualities.`,
  `Consider the consequences of my decisions.`,
  `Write stories or poems.`,
  `Be honest with people.`,
  `Avoid temptation.`,
  `Get things done by myself.`,
  `Get along with people from different backgrounds.`
]




export const BESSI_45_ACTIVITIES = [
  `Plan out my time.`,
  `Lead a group of people.`,
  `Understand how other people feel.`,
  `Calm down when I'm feeling anxious.`,
  `Understand abstract ideas.`,
  `Concentrate on a task.`,
  `Express my thoughts and feelings.`,
  `See the good in people.`,
  `Keep a positive attitude.`,
  `Come up with new ideas.`,
  `Keep track of my promises and commitments.`,
  `Start a conversation.`,
  `Cooperate with other people.`,
  `Control my temper.`,
  `Create art.`,
  `Work toward my goals.`,
  `Speak up when I disagree with others.`,
  `Get along with people.`,
  `Find reasons to feel good about myself.`,
  `Learn about other cultures.`,
  `Keep things neat and tidy.`,
  `Maintain a high energy level.`,
  `Take responsibility when I've made a mistake.`,
  `Control my impulses.`,
  `Make sense of complex information.`,
  `Do tasks that are routine or repetitive.`,
  `Assert myself as a leader.`,
  `Sympathize with other people's feelings.`,
  `Settle down when I'm feeling nervous.`,
  `Discuss complicated topics and ideas.`,
  `Double-check my work.`,
  `Tell people how I am feeling.`,
  `Forgive people quickly.`,
  `Stay positive when something bad happens.`,
  `Invent things.`,
  `Follow the rules.`,
  `Talk to people.`,
  `Work as part of a group.`,
  `Stop myself from getting angry.`,
  `Draw or paint.`,
  `Think things through carefully.`,
  `Win arguments.`,
  `Make a positive impression on people.`,
  `See my good qualities.`,
  `Understand people from different backgrounds.`,
]





export const BESSI_ACTIVITY_BANK: BessiActivityType[] = BESSI_ACTIVITIES.map(
  (activity, index) => ({
  id: index + 1,
  activity,
  facet: getFacet(index + 1),
  ...getSkillDomainAndWeight(getFacet(index + 1))
}))



export const BESSI_45_ACTIVITY_BANK: BessiActivityType[] = BESSI_45_ACTIVITIES.map(
  (activity, index) => ({
  id: index + 1,
  activity,
  facet: getFacet(index + 1),
  ...getSkillDomainAndWeight(getFacet(index + 1))
}))