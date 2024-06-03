// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import { FacetFactorType, SkillDomainFactorType } from '@/utils'



type RidgelinePlotProps = {
  data: {
    facetScores: FacetFactorType
    domainScores: SkillDomainFactorType
  }
}




const RidgelinePlot: FC<RidgelinePlotProps> = ({ data }) => {
  const facetRef = useRef(null)
  const domainRef = useRef(null)

  useEffect(() => {
    const drawPlot = (scores, ref, plotTitle) => {
      const margin = { top: 40, right: 30, bottom: 30, left: 30 }
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

      const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))

      const densities = keys.map(key => ({
        key,
        density: kde([scores[key]])
      }))

      const area = d3.area()
        .curve(d3.curveBasis)
        .x(d => x(d[0]))
        .y0(y.bandwidth())
        .y1((d: any) => y.bandwidth() as number - (y(d[1]) as number))

      svg.selectAll('areas')
        .data(densities)
        .enter()
        .append('path')
        .attr('transform', d => `translate(0, ${ y(d.key) })`)
        .datum(d => d.density)
        .attr('fill', '#69b3a2')
        .attr('opacity', 0.6)
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .attr('d', area)

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('text-decoration', 'underline')
        .text(plotTitle)

      function kernelDensityEstimator(kernel, x) {
        return function (sample) {
          return x.map(
            x => [
              x,
              d3.mean(
                sample, 
                v => kernel(x - (v as number))
              )
            ]
          )
        }
      }

      function kernelEpanechnikov(k): (v: any) => boolean {
        return function (v): boolean {
          return Math.abs(
            v /= k
          ) <= (
            1 
              ? 0.75 * (1 - v * v) / k 
              : 0
          )
        }
      }
    }

    drawPlot(data.facetScores, facetRef, 'Facet Scores')
    drawPlot(data.domainScores, domainRef, 'Domain Scores')

  }, [data])

  return (
    <div>
      <svg ref={ facetRef }></svg>
      <svg ref={ domainRef }></svg>
    </div>
  )
}


export default RidgelinePlot