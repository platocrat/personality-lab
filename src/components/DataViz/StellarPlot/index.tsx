// Externals
import * as d3 from 'd3'
import React, { useRef, useEffect, FC } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
// Utils
import { 
  FacetFactorType,
  SkillDomainFactorType, 
  BarChartTargetDataType, 
} from '@/utils'
// CSS
import styles from '@/components/DataViz/DataViz.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type StellarPlotProps = {
  isExample: boolean
  data: {
    axis: string
    value: number
  }[]
}



const StellarPlot: FC<StellarPlotProps> = ({ 
  data,
  isExample,
}) => {
  const d3Container = useRef<any>(null)

  const title = `BESSI Stellar Plot`



  useEffect(() => {
    const width = 500,
      height = 500,
      margin = { top: 90, right: 90, bottom: 90, left: 90 },
      radius = (Math.min(width, height) / 2) - Math.max(
        ...Object.values(margin)
      )

    // Remove any existing svg to avoid duplicates
    d3.select(d3Container.current).select('svg').remove()

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '-270 -190 540 440')
      .classed(styles.svgContent, true)

    // Scale for the radius
    const rScale = d3.scaleLinear()
      .domain([0, 1]) // Assuming value is normalized between 0 and 1
      .range([0, radius])

    // Calculate the angle for each axis
    const angleSlice = Math.PI * 2 / data.length

    const levels = 10
    const maxValue = 100 // Assuming the outermost value is 100

    // Define a color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10) // You can choose any other scheme or custom colors

    // Draw the background circles
    for (let i = 0; i <= levels; i++) {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius * i / levels)
        .style('fill', 'none')
        .style('stroke', 'grey')
        .style('fill-opacity', 0.1)
        .style('stroke-opacity', i === levels ? 0.75 : 0.15) // Full opacity for outer circle
    }

    // Draw the radar chart axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper')

    // // After drawing the rings
    // axisGrid.selectAll('.levels')
    //   .data(d3.range(1, levels + 1).reverse())
    //   .enter()
    //   .append('circle')
    //   .attr('r', d => radius / levels * d)
    //   .style('fill', '#CDCDCD')
    //   .style('stroke', '#CDCDCD')
    //   .style('fill-opacity', 0.001)

    // // Add labels for each ring
    // axisGrid.selectAll('.levelLabel')
    //   .data(d3.range(1, levels + 1))
    //   .enter()
    //   .append('text')
    //   .attr('class', 'levelLabel')
    //   .attr('x', 4) // Small horizontal offset
    //   .attr('y', d => -d * radius / levels)
    //   .attr('dy', '0.4em') // To slightly center the text vertically
    //   .style('font-size', '10px')
    //   .attr('fill', '#737373')
    //   .text(d => `${d * maxValue / levels}`)

    axisGrid.selectAll('.axis')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr(
        'x2',
        (d, i: number): number => rScale(1) * Math.cos(
          angleSlice * i - Math.PI / 2
        )
      )
      .attr(
        'y2',
        (d, i: number): number => rScale(1) * Math.sin(
          angleSlice * i - Math.PI / 2
        )
      )
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)

    // Add labels
    axisGrid.selectAll('.axisLabel')
      .data(data)
      .enter().append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text((d: any) => d.axis)

    const columnWidth = 230 // Width of each column, adjust as needed
    const itemsPerColumn = Math.ceil(data.length / 2) // Calculate items per column
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        // Adjust as needed
        `translate(-${width / 2}, ${height / 2 - margin.bottom + 20})`
      )

    // Add the data points
    // Draw tapered lines for each data point
    data.forEach((d: { axis: string, value: number }, i: number): void => {
      const nextPointAngle = angleSlice * (i + 1) - Math.PI / 2
      const line = svg.append('line')
        .attr('x1', 0) // Start at the center
        .attr('y1', 0)
        .attr('x2', rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)) // Extend to the data point
        .attr('y2', rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('stroke', colorScale(`${d.axis}`))
        .attr('stroke-width', 15)
        .attr('stroke-opacity', 0.5)

      // Calculate midpoint for taper effect (adjust '0.7' to control the taper)
      const midPointRadius = rScale(d.value) * 1 // Adjust this value to control the tapering effect
      const midX = midPointRadius * Math.cos(angleSlice * i - Math.PI / 2)
      const midY = midPointRadius * Math.sin(angleSlice * i - Math.PI / 2)

      // Draw the line back towards the center
      const lineBack = svg.append('line')
        .attr('x1', rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr('y1', rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr('x2', midX) // End partway back to the center
        .attr('y2', midY)
        .attr('stroke', colorScale(`${d.value}`))
        .attr('stroke-width', 1) // Make this line thinner to enhance the tapered effect
        .attr('stroke-opacity', 0.65) // Optional: adjust opacity for stylistic effect

      const columnIndex = Math.floor(i / itemsPerColumn) // Determine which column this item belongs to
      const xPosition = (columnIndex * columnWidth) + 10 // Calculate the x position based on the column
      const yPosition = (i % itemsPerColumn) * 20 // Calculate the y position within the column

      // Draw legend symbols (e.g., rectangles)
      legend.append('rect')
        .attr('x', xPosition)
        .attr('y', yPosition)
        .attr('width', 10) // Size of the legend symbol
        .attr('height', 10)
        .style('fill', colorScale(`${d.axis}`)) // Or dynamically set based on data
        .style('opacity', '0.75') // Match the opacity of the tapered lines

      // Add legend text
      legend.append('text')
        .attr('x', xPosition + 20) // Position text next to the symbol; adjust as needed
        .attr('y', yPosition + 9) // Align text with the symbol; adjust as needed
        .text(`${d.axis}: ${Math.floor(d.value * 100)}`) // Display the label and its value
        .style('font-size', '14px') // Adjust font size as needed
        .attr('alignment-baseline', 'middle')
    })
  }, [data]) // Ensure effect runs when data changes


  return (
    <>
      <div 
        style={{ 
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        }}
      >
        <Title isExample={ isExample } title={ title } />
        <div 
          ref={ d3Container } 
          style={ definitelyCenteredStyle } 
          className={ styles.svgContainer }
        />
      </div>
    </>
  )
}

export default StellarPlot