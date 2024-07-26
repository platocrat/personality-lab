// Externals
import * as d3 from 'd3'
import React, { FC, useEffect, useRef } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
// Utils
import { 
  gaussian,
  StatsType,
  calculateStats,
  FacetFactorType,
  SkillDomainFactorType,
  kernelDensityEstimator,
  // kernelEpanechnikov,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



export type RidgelinePlotDataType = {
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
  populationFacetScores: { [key: string]: number[] }
  populationDomainScores: { [key: string]: number[] }
}


type RidgelinePlotProps = {
  isSample: boolean
  isExample: boolean
  data: RidgelinePlotDataType
}




const RidgelinePlot: FC<RidgelinePlotProps> = ({ 
  data,
  isSample,
  isExample,
}) => {
  const facetRef = useRef(null)
  const domainRef = useRef(null)
  
  const TITLE = 'Ridgeline Plot'

  const {
    facetScores,
    domainScores,
    populationFacetScores,
    populationDomainScores,
  } = data

  const facetScoresStats: StatsType = calculateStats(
    populationFacetScores, 
    isSample
  )
  const domainScoresStats: StatsType = calculateStats(
    populationDomainScores, 
    isSample
  )


  useEffect(() => {
    // Remove any existing svg to avoid duplicates
    d3.select(facetRef.current).select('svg').remove()
    d3.select(domainRef.current).select('svg').remove()


    const drawPlot = (
      scores, 
      stats, 
      ref, 
      plotTitle: string
    ): void => {
      const margin = { top: 40, right: 30, bottom: 30, left: 140 }
      const width = 800 - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom

      const svg = d3.select(ref.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const keys = Object.keys(scores)
      const maxScore = 100

      const x = d3.scaleLinear()
        .domain([0, maxScore])
        .range([0, width])

      const y = d3.scaleBand()
        .domain(keys)
        .range([height, 0])
        .padding(0.1)

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))

      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y))


      function kernelEpanechnikov(k): (v) => number {
        return function (v): number {
          return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0
        }
      }

      const kde = kernelDensityEstimator(d3, kernelEpanechnikov, x.ticks(100))

      const densities = keys.map((key: string) => {
        const mean = stats[key]?.mean ?? 0
        const stddev = stats[key]?.stddev ?? 1

        const distances = d3.range(0, maxScore).map(value => (value - mean) / stddev)

        const density = distances.map((v) => {
          return kernelEpanechnikov(1)(v) // Assuming k = 1 for the kernel function
        })

        return {
          key,
          density
        }
      })


      console.log(`${ plotTitle } densities: `, densities)
      console.log(`${ plotTitle } densities: `, densities)


      const yScale = d3.scaleLinear()
        .domain(
          [
            0,
            d3.max(
              densities, 
              (d: any) => d3.max(
                d.density, 
                (d: any) => (d[1] as number)
              )
            )
          ] as any
        )
        .range([y.bandwidth(), 0])


      const area = d3.area()
        .curve(d3.curveBasis)
        .x(d => x(d[0]))
        .y0(y.bandwidth())
        .y1(d => yScale(d[1]))

      svg.selectAll('areas')
        .data(densities)
        .enter()
        .append('path')
        .attr('transform', d => `translate(0, ${y(d.key)})`)
        .datum(d => d.density)
        .attr('fill', '#69b3a2')
        .attr('opacity', 0.6)
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .attr('d', area as any)

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('text-decoration', 'underline')
        .text(plotTitle)

      // svg.selectAll('markers')
      //   .data(keys)
      //   .enter()
      //   .append('line')
      //   .attr('x1', key => x(scores[key]))
      //   .attr('x2', key => x(scores[key]))
      //   .attr('y1', key => y(key) as number)
      //   .attr('y2', key => (y(key) as number) + y.bandwidth())
      //   .attr('stroke', 'red')
      //   .attr('stroke-width', 2)
    }


    drawPlot(facetScores, facetScoresStats, facetRef, 'Facet Scores')
    drawPlot(domainScores, domainScoresStats, domainRef, 'Domain Scores')
  }, [data])



  return (
    <>
      <svg ref={ facetRef }></svg>
      <svg ref={ domainRef }></svg>
    </>
  )
}


export default RidgelinePlot