type StatsType = {
  [key: string]: {
    mean: number
    stddev: number
  }
}


export function calculateStats(
  data: Record<string, number[]>, 
  isSample: boolean
): StatsType {
  const stats: Record<string, { mean: number, stddev: number }> = {}

  Object.entries(data).forEach(([key, scores]): void => {
    const mean = calculateMean(scores)
    const stddev = calculateStandardDeviation(scores, mean, isSample)
    stats[key] = { mean, stddev }
  })

  return stats
}


export function calculateMean(scores: number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, score): number => acc + score, 0)
  return sum / scores.length
}


export function calculateStandardDeviation(
  scores: number[], 
  mean: number, 
  isSample: boolean
): number {
  const n = scores.length
  
  if (n <= 1) return 0
  
  const variance = scores.reduce(
    (acc, score) => acc + Math.pow(
      score - mean, 
      2
    ), 0) / (
      isSample ? n - 1 : n
    )

  return Math.sqrt(variance)
}
