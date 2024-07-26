const facets = [
  "Task Management",
  "Time Management",
  "Detail Management",
  "Organizational Skill",
  "Responsibility Management",
  "Capacity for Consistency",
  "Goal Regulation",
  "Rule-Following Skill",
  "Decision-Making Skill",
  "Leadership Skill",
  "Persuasive Skill",
  "Conversational Skill",
  "Expressive Skill",
  "Energy Regulation",
  "Teamwork Skill",
  "Capacity for Trust",
  "Perspective-Taking Skill",
  "Capacity for Social Warmth",
  "Ethical Competence",
  "Stress Regulation",
  "Capacity for Optimism",
  "Anger Management",
  "Confidence Regulation",
  "Impulse Regulation",
  "Abstract Thinking Skill",
  "Creative Skill",
  "Artistic Skill",
  "Cultural Competence",
  "Information Processing Skill"
]

const domains = [
  "Self-Management Skills",
  "Social Engagement Skills",
  "Cooperation Skills",
  "Emotional Resilience Skills",
  "Innovation Skills"
]

export function generateRandomBessiScores(n: number) {
  const values: any[] = []
  for (let i = 0; i < n; i++) {
    values.push(Math.floor(Math.random() * 100))
  }
  return values
}

export const RIDGELINE_DEMO_FACET_DATA = (n: number) => facets.map(facet => ({
  key: facet,
  values: generateRandomBessiScores(n),
}))

export const RIDGELINE_DEMO_DOMAIN_DATA = (n: number) => domains.map(domain => ({
  key: domain,
  values: generateRandomBessiScores(n),
}))