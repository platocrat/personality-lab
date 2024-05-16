export type FacetDataType = { name: string, score: number }


export type InputDataStructure = {
  domainScores: { [key: string]: number }
  facetScores: { [key: string]: number }
}


export type TargetDataStructure = {
  name: string           // The label for the group on the x-axis
  domainScore: number    // The value to assign next to each domain name in legend
  facetScores: number[]  // The height or value of the bar
  facets: {
    name: string         // The label for the individual bar within the group
    score: number        // The height or value of the bar
  }[]
}