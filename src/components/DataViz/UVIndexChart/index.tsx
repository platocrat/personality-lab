// Externals
import * as d3 from 'd3'
import React, { useRef, useEffect } from 'react'


const UVIndexChart = ({ uvValue = 1, currentHour = 0 }) => {
  const d3Container = useRef<SVGSVGElement | null>(null)


  useEffect(() => {
    const svg = d3.select(d3Container.current)
    const width = +svg.attr('width')
    const height = +svg.attr('height')
    const outerRadius = Math.min(width, height) / 2
    const innerRadius = outerRadius * 0.8
    const hourScale = d3.scaleLinear().domain([0, 12]).range([0, 2 * Math.PI])
    const uvScale = d3.scaleLinear().domain([0, 11]).range([0, 2 * Math.PI])
    const clockRadius = outerRadius * 0.9 // Radius where the clock numbers will be
    const indexRadius = innerRadius * 0.85 // Radius where the index numbers will be

    // Clear the current SVG to prevent duplication
    svg.selectAll('*').remove()

    // Function to determine UV index color
    const getUVColor = (value) => {
      if (value <= 2) return 'green'
      if (value <= 5) return 'yellow'
      if (value <= 7) return 'orange'
      if (value <= 10) return 'red'
      return 'violet'
    }

    // Define the arc generator for the outer circle
    const outerArcGenerator: any = d3.arc()
      .innerRadius(outerRadius * 0.8)
      .outerRadius(outerRadius)
      .startAngle((d, i) => hourScale(i))
      .endAngle((d, i) => hourScale(i + 1))

    // Define the arc generator for the inner circle
    const innerArcGenerator: any = d3.arc()
      .innerRadius(innerRadius * 0.7)
      .outerRadius(innerRadius)
      .startAngle(0)

    // Draw the outer circle's hourly segments
    svg.selectAll('.hour-arc')
      .data(d3.range(12))
      .enter().append('path')
      .attr('fill', (d, i) => (i === currentHour) ? '#666' : '#ccc')
      .attr('d', outerArcGenerator)
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    // Draw the inner circle for the UV index
    svg.append('path')
      .datum({ endAngle: uvScale(11) })
      .style('fill', 'green')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('d', innerArcGenerator)

    // Overlay the UV index value arc on top
    svg.append('path')
      .datum({ endAngle: uvScale(uvValue) })
      .style('fill', 'orange')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('d', innerArcGenerator)

    // Add hour markers to the outer circle
    d3.range(12).forEach(i => {
      svg.append('text')
        .attr('x', width / 2 + clockRadius * Math.sin(hourScale(i)))
        .attr('y', height / 2 - clockRadius * Math.cos(hourScale(i)))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '14px')
        .text(i === 0 ? 12 : i) // Replace '0' with '12'
    })

    // Add index markers to the inner circle
    d3.range(12).forEach(i => {
      svg.append('text')
        .attr('x', width / 2 + indexRadius * Math.sin(hourScale(i)))
        .attr('y', height / 2 - indexRadius * Math.cos(hourScale(i)))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '14px')
        .text(i === 0 ? 12 : i) // Replace '0' with '12'
    })

    // Add UV value text
    const uvText: any = svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '48px')
      .text(uvValue)

    // Add "Low" text underneath UV value
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + uvText.node().getBBox().height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .text('Low')

  }, [uvValue, currentHour])

  return (
    <svg ref={ d3Container } width={ 300 } height={ 300 } />
  )
}

export default UVIndexChart
