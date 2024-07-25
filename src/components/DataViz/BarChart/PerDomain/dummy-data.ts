import { UserScoresType, getFacet, getSkillDomainAndWeight } from "@/utils"



export function generateDummyBessiUserScores() {
  const bessiUserScores: any = []

  for (let i = 1; i < 193; i++) {
    const activityIndex = i
    const value = Math.floor(Math.random() * 6) // random value between 0 and 5

    bessiUserScores.push({
      facet: getFacet(activityIndex),
        ...getSkillDomainAndWeight(getFacet(activityIndex)),
        response: value,
    })
  }

  return bessiUserScores
}




export const DUMMY_BESSI_USER_SCORES = [
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 1
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 1
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 0
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 2
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 3
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 3
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 5
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 3
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 5
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 3
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 1
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 1
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 5
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 0
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 2
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 1
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 2
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 0
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 4
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 1
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 4
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 2
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 5
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Leadership Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Perspective-Taking Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Time Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Abstract Thinking Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Stress Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Organizational Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Energy Regulation",
    "domain": [
      "Self-Management Skills",
      "Social Engagement Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Capacity for Trust",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Capacity for Consistency",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Self-Reflection Skill",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Capacity for Optimism",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 5
  },
  {
    "facet": "Task Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Persuasive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Capacity for Social Warmth",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Detail Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Creative Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Expressive Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Rule-Following Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Adaptability",
    "domain": [],
    "weight": 0,
    "response": 2
  },
  {
    "facet": "Anger Management",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Responsibility Management",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 3
  },
  {
    "facet": "Information Processing Skill",
    "domain": [
      "Self-Management Skills",
      "Innovation Skills"
    ],
    "weight": 0.5,
    "response": 5
  },
  {
    "facet": "Teamwork Skill",
    "domain": [
      "Cooperation Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Goal Regulation",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Conversational Skill",
    "domain": [
      "Social Engagement Skills"
    ],
    "weight": 1,
    "response": 4
  },
  {
    "facet": "Confidence Regulation",
    "domain": [
      "Emotional Resilience Skills"
    ],
    "weight": 1,
    "response": 0
  },
  {
    "facet": "Decision-Making Skill",
    "domain": [
      "Self-Management Skills"
    ],
    "weight": 1,
    "response": 1
  },
  {
    "facet": "Artistic Skill",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 2
  },
  {
    "facet": "Ethical Competence",
    "domain": [
      "Self-Management Skills",
      "Cooperation Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Impulse Regulation",
    "domain": [
      "Self-Management Skills",
      "Emotional Resilience Skills"
    ],
    "weight": 0.5,
    "response": 4
  },
  {
    "facet": "Capacity for Independence",
    "domain": [],
    "weight": 0,
    "response": 3
  },
  {
    "facet": "Cultural Competence",
    "domain": [
      "Innovation Skills"
    ],
    "weight": 1,
    "response": 5
  }
]