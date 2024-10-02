export type StatsType = {
  [key: string]: {
    mean: number
    stddev: number
  }
}



export function calculateStats(
  populationOrSampleData: { [key: string]: number[] },
  isSample: boolean
): StatsType {
  const stats: StatsType = {}

  Object.keys(populationOrSampleData).forEach((key): void => {
    const scores = populationOrSampleData[key]
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



export function gaussian(distance: number): number {
  return (
    1 / Math.sqrt(2 * Math.PI)
  ) * Math.exp(
    -0.5 * (distance ** 2) 
  )
}



export function kernelEpanechnikov(k): (v) => number {
  return function (v): number {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0
  }
}



export function generateRandomInteger(n: number): number {
  return Math.floor(Math.random() * n)
}



export function getRandomValueInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}