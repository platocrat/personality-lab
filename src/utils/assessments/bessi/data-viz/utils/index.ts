// Locals
import { domainToFacetMapping } from '../../constants'
// Types
import { 
  FacetDataType, 
  BarChartInputDataType,
  BarChartTargetDataType, 
} from '../types'




export function convertToAbbreviation(input: string): string {
  const words = input.split(' ')
  const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join(' ')
  return abbreviation
}


export function findFacetByScore(
  data: BarChartTargetDataType[],
  facetScore: number,
  facetScoreIndex: number
): FacetDataType | undefined {
  for (const domain of data) {
    const { facets, facetScores } = domain
    const scoreIndex = facetScores.findIndex(
      (score: number, index: number): boolean => (
        score === facetScore && index === facetScoreIndex
      )
    )

    if (scoreIndex !== -1 && facets[scoreIndex]) {
      return {
        name: facets[scoreIndex].name,
        score: facets[scoreIndex].score
      }
    }
  }

  return undefined
}


export function generateHighContrastColors(count: number): string[] {
  const goldenRatioConjugate = 0.618033988749895 // Golden ratio to ensure good distribution
  const colors: string[] = []

  let hue = Math.random() // Start at a random hue

  for (let i = 0; i < count; i++) {
    hue += goldenRatioConjugate
    hue %= 1 // Keep hue within the range [0, 1)

    const color = `hsl(${hue * 360}, 70%, 50%)` // Convert to HSL format
    colors.push(color)
  }

  return colors
}



export function transformData(
  inputData: BarChartInputDataType
): BarChartTargetDataType[] {
  return Object.keys(inputData.domainScores).map(domainName => {
    const facets: FacetDataType[] = domainToFacetMapping[domainName].map(
      (facetName: string): FacetDataType => ({
        name: facetName,
        score: inputData.facetScores[facetName] || 0,
      })
    )

    return {
      // Use the conversion function here
      // name: convertToAbbreviation(domainName),
      name: domainName,
      domainScore: inputData.domainScores[domainName],
      facets,
      facetScores: facets.map((facet: FacetDataType): number => facet.score)
    }
  })
}



export function generateAreaUnderCurve(
  d3,
  mean: number,
  stddev: number
): { x: number, y: number }[] {
  const xValues = d3.range(
    mean - 3 * stddev,
    mean + 3 * stddev,
    stddev / 50
  )

  const yValues = xValues.map(
    x => (
      1 / (
        stddev * Math.sqrt(2 * Math.PI)
      )
    ) * Math.exp(
      -0.5 * (
        (x - mean) / stddev
      ) ** 2
    )
  )

  const _: { x: number, y: number }[] = xValues.map(
    (x: number, i: number): { x: number, y: number } => ({ x, y: yValues[i] })
  )

  return _
}



// Function to generate the normal distribution curve
export function generateNormalDistributionCurve(
  d3,
  mean: number,
  stddev: number
): { x: number, y: number }[]  {
  const xValues = d3.range(
    mean - 3 * stddev,
    mean + 3 * stddev, stddev / 50
  )

  const yValues = xValues.map(
    x => (
      1 / (
        stddev * Math.sqrt(2 * Math.PI)
      )
    ) * Math.exp(
      -0.5 * (
        (x - mean) / stddev
      ) ** 2
    )
  )

  const _: { x: number, y: number }[] = xValues.map(
    (x: number, i: number): { x: number, y: number } => ({ x, y: yValues[i] })
  )

  return _
}



export function getRangeLabel(score: number): 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | 'Out of range' {
  const isVeryLow = score >= 0 && score <= 20
  const isLow = score > 20 && score <= 40
  const isMedium = score > 40 && score <= 60
  const isHigh = score > 60 && score <= 80
  const isVeryHigh = score > 80 && score <= 100

  if (isVeryLow) {
    return 'Very Low'
  } else if (isLow) {
    return 'Low'
  } else if (isMedium) {
    return 'Medium'
  } else if (isHigh) {
    return 'High'
  } else if (isVeryHigh) {
    return 'Very High'
  } else {
    return 'Out of range'
  }
}



export const rgbToRgba = (rgb: string, opacity: number): string => {
  const rgbValues = rgb.match(/\d+/g)

  if (rgbValues && rgbValues.length === 3) {
    const [r, g, b] = rgbValues
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return rgb // Fallback to the original rgb if there's an issue
}