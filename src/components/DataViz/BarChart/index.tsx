// Externals
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



/**
 * @todo Fix `data` to match format similar to `StellarPlot` component
 */
const BarChart = ({ data }) => {
  const d3Container = useRef(null)

  const title = `BESSI Bar Chart`

  
  
  useEffect(() => {
    if (data && d3Container.current) {
      const margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom

      // Clear the container
      d3.select(d3Container.current).selectAll("*").remove()

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 85)
        .append('g')
        .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)

      // X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.metrics))
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
        .domain([0, 100])
        .range([height, 0])

      svg.append('g')
        .call(d3.axisLeft(y).tickValues([0, 100])) // Specify tick values here
        .attr('font-size', '12px')

      // Bars
      svg.selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) => x(d.metric as string) as number)
        .attr('y', (d: any) => y(d.value as number))
        .attr('width', x.bandwidth())
        .attr('height', (d: any) => height - y(d.value))
        .attr('fill', '#ACD8FF')
        .attr('opacity', 1) // Make bars slightly opaque
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 1)

      // Labels
      svg.selectAll('.label')
        .data(data)
        .join('text')
        .attr('class', 'label')
        .attr(
          'x', 
          (d: any) => (
            x(d.metric as string) as number
          ) + x.bandwidth() / 2
        )
        .attr('y', (d: any) => y(d.value) + 20) // Adjust label position
        .attr('text-anchor', 'middle')
        .text((d: any) => d.value)
        .attr('font-size', '13px')
        .attr('opacity', 0.5)
    }
  }, [data])


  return (
    <>
      <h3 style={ definitelyCenteredStyle }>{ title }</h3>
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}

export default BarChart
