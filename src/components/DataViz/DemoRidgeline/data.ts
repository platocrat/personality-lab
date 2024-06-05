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

function generateRandomValues() {
  const values: any[] = []
  for (let i = 0; i < 42; i++) {
    values.push(Math.floor(Math.random() * 100))
  }
  return values
}

export const RIDGELINE_DEMO_FACET_DATA = facets.map(facet => ({
  key: facet,
  values: generateRandomValues(),
}))

export const RIDGELINE_DEMO_DOMAIN_DATA = domains.map(domain => ({
  key: domain,
  values: generateRandomValues(),
}))
