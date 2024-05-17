// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import '@/components/DataViz/Distributions/Normal/NormalDistribution.css'
import { 
  generateAreaUnderCurve, 
  generateNormalDistributionCurve,
} from '@/utils'




type NormalDistributionChartProps = {
  mean: number
  score: number
  stddev: number
}


const NormalDistributionChart: FC<NormalDistributionChartProps> = ({ 
  mean, 
  score,
  stddev,
}) => {
  const svgRef = useRef<any>()



  useEffect(() => {
    const areaData = generateAreaUnderCurve(d3, mean, stddev)
    const data = generateNormalDistributionCurve(d3, mean, stddev)

    const points = [
      { x: mean - 3 * stddev, label: 'μ - 3σ' },
      { x: mean - 2.5 * stddev, label: 'μ - 2.5σ' },
      { x: mean - 2 * stddev, label: 'μ - 2σ' },
      { x: mean - 1.5 * stddev, label: 'μ - 1.5σ' },
      { x: mean - 1 * stddev, label: 'μ - σ' },
      { x: mean - 0.5 * stddev, label: 'μ - 0.5σ' },
      { x: mean, label: 'μ' },
      { x: mean + 0.5 * stddev, label: 'μ + 0.5σ' },
      { x: mean + 1 * stddev, label: 'μ + σ' },
      { x: mean + 1.5 * stddev, label: 'μ + 1.5σ' },
      { x: mean + 2 * stddev, label: 'μ + 2σ' },
      { x: mean + 2.5 * stddev, label: 'μ + 2.5σ' },
      { x: mean + 3 * stddev, label: 'μ + 3σ' },
    ]


    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = 600 - margin.left - margin.right
    const height = 350 - margin.top - margin.bottom


    const x = d3.scaleLinear()
      .domain([mean - 3 * stddev, mean + 3 * stddev])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.y)])
      .range([height, 0])

    const line = d3.line()
      .x((d: any) => x(d.x))
      .y((d: any) => y(d.y))
      .curve(d3.curveBasis)

    // Create the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Append the line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Add x-axis
    const xAxis = d3.axisBottom(x)
      .ticks(7)
      .tickFormat((d, i) => {
        switch (i) {
          case 0: return `μ - 3σ`
          case 1: return `μ - 2σ`
          case 2: return `μ - σ`
          case 3: return `μ`
          case 4: return `μ + σ`
          case 5: return `μ + 2σ`
          case 6: return `μ + 3σ`
          default: return ''
        }
      })

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .style('font-size', '13px')

    // Add y-axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .style('font-size', '13px')

    const area = d3.area()
      .x((d: any) => x(d.x))
      .y0(height)
      .y1((d: any) => y(d.y))
      .curve(d3.curveBasis)

    svg.append('path')
      .datum(areaData)
      .attr('fill', 'lightblue')
      .attr('opacity', 0.15)  // Adjust opacity as needed
      .attr('d', area)

    // Add vertical line for data point
    svg.append('line')
      .attr('x1', x(score))
      .attr('x2', x(score))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4')

    // Add text label for data point
    svg.append('text')
      .attr('x', x(score) - 1.75)
      .attr('y', -5)
      .attr('fill', 'red')
      .attr('text-anchor', 'middle')
      .text(`Score: ${score}`)

    // Tooltip div
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'white')
      .style('box-shadow', '0 0 5px rgba(0, 0, 0, 0.3)')
      .style('padding', '8px 12px')
      .style('border-radius', '5px')
      .style('font-size', '13.5px')
      
      // Add points with tooltips
      svg.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y((1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((d.x - mean) / stddev) ** 2)))
      .attr('r', 5)
      .attr('fill', 'lightblue')
      .attr('stroke', 'steelblue')  // Add border color
      .attr('stroke-width', 1)  // Add border width
      .on('mouseover', (event, d) => {
        const yValue = (
          1 / (
            stddev * Math.sqrt(2 * Math.PI)
          )
        ) * Math.exp(
          -0.5 * ((d.x - mean) / stddev) ** 2
        )
        
        tooltip.html(
          `
          <div style="width: 180px">         
            <div style="display: flex; justify-content: space-between;">
              <p>Score:</p>
              <p>${d.x.toFixed(2)}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p>Probability Density:</p>
              <p>${yValue.toFixed(4)}</p>
            </div>
          </div>
          `
        )
        
        tooltip.style('visibility', 'visible')
          .classed('visible', true)

        // Highlight the circle
        d3.select(event.target)
          .transition()
          .duration(100)
          .attr('r', 8)  // Increase the radius
          .attr('stroke', 'steelblue')  // Add border color
          .attr('stroke-width', 2.5)  // Add border width
      })
      .on('mousemove', event => {
        return tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`)
      })
      .on('mouseout', (event, d) => {
        tooltip.style('visibility', 'hidden')
          .classed('visible', false)

        // Remove the highlight
        d3.select(event.target)
          .transition()
          .duration(100)
          .attr('r', 5)
          .attr('fill', 'lightblue')
          .attr('stroke', 'steelblue')  // Add border color
          .attr('stroke-width', 1)  // Add border width
      })
      
      // Add a separate tooltip for the score data point
      const scoreTooltip = d3.select('body').append('div')
        .attr('className', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', 'white')
        .style('box-shadow', '0 0 5px rgba(0, 0, 0, 0.3)')
        .style('padding', '8px 12px')
        .style('border-radius', '5px')
        .style('font-size', '13.5px')

    svg.append('circle')
      .attr('cx', x(score))
      .attr('cy', y((1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((score - mean) / stddev) ** 2)))
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'darkred')  // Add border color
      .attr('stroke-width', 1)  // Add border width
      .on('mouseover', (event, d) => {
        const yValue = (
          1 / (
            stddev * Math.sqrt(2 * Math.PI)
          )
        ) * Math.exp(
          -0.5 * ((score - mean) / stddev) ** 2
        )

        scoreTooltip.html(
          `
          <div style="width: 180px">         
            <div style="display: flex; justify-content: space-between;">
              <p>Score:</p>
              <p>${score.toFixed(2)}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p>Probability Density:</p>
              <p>${yValue.toFixed(4)}</p>
            </div>
          </div>
          `
        )
        
        scoreTooltip.style('visibility', 'visible')
          .classed('visible', true)

        // Highlight the circle
        d3.select(event.target)
          .transition()
          .duration(100)
          .attr('r', 8)  // Increase the radius
          .attr('stroke', 'darkred')  // Add border color
          .attr('stroke-width', 2)  // Add border width
      })
      .on('mousemove', event => {
        return scoreTooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`)
      })
      .on('mouseout', (event, d) => {
        scoreTooltip.style('visibility', 'hidden')
          .classed('visible', false)

        // Remove the highlight
        d3.select(event.target)
          .transition()
          .duration(100)
          .attr('r', 5)
          .attr('fill', 'red')
          .attr('stroke', 'darkred')  // Add border color
          .attr('stroke-width', 2)  // Add border width
      })


    return () => {
      tooltip.remove()
      scoreTooltip.remove()
    }
  }, [mean, stddev, score])



  return (
    <svg ref={ svgRef }></svg>
  )
}


export default NormalDistributionChart