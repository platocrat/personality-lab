// Externals
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
// Locals
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'

/**
 * Directly uses the domainScores from the data object according to the provided type definition.
 */
const BarChart = ({ isExample, data }) => {
  const d3Container = useRef(null)
    
  const title = 'BESSI Bar Chart'


  
  useEffect(() => {
    if (data?.domainScores && d3Container.current) {
      const entries = Object.entries(
        data.domainScores
      ).map(([key, value]) => ({
        domain: key,
        score: value
      }))


      // console.log(`entries: `, entries)


      const margin = { top: 20, right: 30, bottom: 40, left: 90 }
      const width = 500 - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom

      // Clear the container
      d3.select(d3Container.current).selectAll('*').remove()

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 85)
        .append('g')
        .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)

      // X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(entries.map(d => d.domain))
        .padding(0.2)

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .attr('font-size', '13px')

      // Add Y axis
      const y = d3.scaleLinear()
        .domain(
          [0, d3.max(
            entries, 
            (d: any) => d.score)
          ]
        )
        .range([height, 0])

      svg.append('g')
        .call(d3.axisLeft(y))
        .attr('font-size', '12px')

      // Bars
      svg.selectAll('.bar')
        .data(entries)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) => x(d.domain) as number)
        .attr('y', (d: any) => y(d.score))
        .attr('width', x.bandwidth())
        .attr('height', (d: any) => height - y(d.score) as number)
        .attr('fill', '#ACD8FF')

      // Labels
      svg.selectAll('.label')
        .data(entries)
        .join('text')
        .attr('class', 'label')
        .attr('x', (d: any) => x(d.domain) as number + x.bandwidth() / 2)
        .attr('y', (d: any) => y(d.score) - 5)
        .attr('text-anchor', 'middle')
        .text((d: any) => d.score)
        .attr('font-size', '13px')
    }
  }, [data])



  return (
    <>
      { !isExample && <h3 style={ definitelyCenteredStyle }>{ title }</h3> }
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}


export default BarChart
