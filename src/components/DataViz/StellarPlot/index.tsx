// Externals
import * as d3 from 'd3'
import React, { useRef, FC, useState, useEffect } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
import BarChartPerDomain from '@/components/DataViz/BarChart/PerDomain'
// Utils
import { 
  FacetFactorType,
  StellarPlotDataType, 
  SkillDomainFactorType, 
  BarChartTargetDataType,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/components/DataViz/StellarPlot/StellarPlot.module.css'



type StellarPlotProps = {
  isExample: boolean
  data: StellarPlotDataType[]
}




const StellarPlot: FC<StellarPlotProps> = ({ 
  data,
  isExample,
}) => {
  // Refs
  const d3Container = useRef<any>(null)
  // States
  const [
    tooltipData, 
    setTooltipData
  ] = useState<BarChartTargetDataType | null>(null)
  const [
    tooltipPosition, 
    setTooltipPosition
  ] = useState<{ x: number; y: number } | null>(null)


  const title = `BESSI Stellar Plot`


  // Helper function to update tooltip position
  const updateTooltipPosition = (event) => {
    if (!d3Container.current) return

    const containerRect = d3Container.current.getBoundingClientRect()

    // Get the mouse position relative to the container
    let x = event.pageX - containerRect.left - window.pageXOffset
    let y = event.pageY - containerRect.top - window.pageYOffset

    // Tooltip dimensions (should match the fixed width and height)
    const tooltipWidth = 340
    const tooltipHeight = 275

    // Offset the tooltip slightly so it doesn't cover the cursor
    const offsetX = 15
    const offsetY = 15

    x += offsetX
    y += offsetY

    // Adjust position if tooltip exceeds container bounds
    if (x + tooltipWidth > containerRect.width) {
      x = containerRect.width - tooltipWidth - 10 // 10px padding
    }
    
    if (y + tooltipHeight > containerRect.height) {
      y = containerRect.height - tooltipHeight - 10
    }

    // Prevent negative positioning
    if (x < 0) x = 10
    if (y < 0) y = 10

    setTooltipPosition({ x, y })
  }


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
      /**
       * @todo StellarPlot shareable image cuts off the domain labels on the 5
       *      axis of the circle
       */
      .attr('viewBox', '-270 -190 540 440')
      .classed(dataVizStyles.svgContent, true)

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
      .enter()
      .append('foreignObject')
      .attr('class', 'axisLabel')
      .attr(
          'x', 
          (d, i): number => (
            rScale(1.1) * Math.cos(
              angleSlice * i - Math.PI / 2)
            ) - 85
        )
      .attr(
        'y', 
        (d, i): number => (
          rScale(1.1) * Math.sin(
            angleSlice * i - Math.PI / 2
          ) - 5
        )
      )
      .attr('width', 170)  // Adjust width as needed
      .attr('height', 20)  // Adjust height as needed
      .html(
        (d: any) => `
          <p style="font-size: 14px; text-align: center;">
            ${d.axis}
          </p>
        `
      )

    const columnWidth = 230 // Width of each column, adjust as needed
    const itemsPerColumn = Math.ceil(data.length / 2) // Calculate items per column
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        // Adjust as needed
        `translate(-${width / 2}, ${height / 2 - margin.bottom + 20})`
      )


    // // Create a tooltip
    // const tooltip = d3.select(d3Container.current).append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0)
    //   .style('position', 'fixed')
    //   .style('height', '275px')
    //   .style('width', '340px')
    //   .style('pointer-events', 'none')
    //   .style('background', 'rgba(255, 255, 255, 0.9)')
    //   .style('text-align', 'left')
    //   .style('border', '1px solid #d3d3d3')
    //   .style('padding', '10px')
    //   .style('border-radius', '8px')
    //   .style('z-index', '100')


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
      legend.append('foreignObject')
        .attr('x', xPosition + 20) // Position text next to the symbol; adjust as needed
        .attr('y', yPosition - 4) // Align text with the symbol; adjust as needed
        .attr('width', 200) // Size of the legend symbol
        .attr('height', 30)
        .style('font-size', '14px') // Adjust font size as needed
        .attr('alignment-baseline', 'middle')
        .style('text-align', 'left')
        .text(`${d.axis}: ${Math.floor(d.value * 100)}`) // Display the label and its value

      /**
       * @todo 1. Make sure that the height and width of the tooltip's 
       *       parent-most `div` of the tooltip is the same for every 
       *       domain.
       *       2. Make sure that the tooltip is activated `onClick` and not
       *       `onHover`. This will ensure that the content within the 
       *       tooltip that is displayed is also interactive, allowing the
       *       user to click on a facet's bar to view more of its details,
       *       while still inside of the tooltip.
       *       3. Part 2) should function like a tooltip inside of a 
       *       tooltip, until I come up with better ideas for how to 
       *       present the facet-details all within the same small data viz
       *       area.
       */
      line
        .datum(d as any)
        .on('mouseover', function (event, d) {
          // Set tooltip data
          setTooltipData(d.barChartData)
          updateTooltipPosition(event)

          // tooltip.style('opacity', 1)

          // Highlight the line
          d3.select(this)
            .style('cursor', 'pointer')
            .transition()
            .duration(175)
            .attr('stroke-width', 20)
            .attr('stroke-opacity', 0.8)
        })
        .on('mousemove', function (event) {
          updateTooltipPosition(event)

          d3
            .transition()
            .duration(100) // Duration of the transition in milliseconds
            .style('left', (event.x) + 'px')
            .style('top', (event.y) + 'px')

          // tooltip
          //   .html(
          //     `
          //     <div>
          //       ${ tooltipData && (
          //         <>
          //           <BarChartPerDomain
          //             data={ tooltipData }
          //             isExample={ isExample }
          //           />
          //         </>
          //       )}
          //     </div>
          //   `
          //   )
          //   .transition()
          //   .duration(100) // Duration of the transition in milliseconds
          //   .style('left', (event.x - 150) + 'px')
          //   .style('top', (event.y) + 'px')
        })
        // Remove the mousemove event handler
        .on('mouseout', function () {
          // Clear tooltip data
          setTooltipData(null)
          setTooltipPosition(null)

          // tooltip.style('opacity', 0)

          // Reset line style
          d3.select(this)
            .transition()
            .duration(100)
            .attr('stroke-width', 15)
            .attr('stroke-opacity', 0.5)
        })
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
          className={ dataVizStyles.svgContainer }
          style={{ 
            ...definitelyCenteredStyle,
            position: 'relative',
          }} 
        >
          { tooltipData && tooltipPosition && (
            <div 
              className={ styles['tooltip'] }
              style={{
                left: tooltipPosition?.x,
                top: tooltipPosition?.y,
              }}
            >
              <BarChartPerDomain data={ tooltipData } isExample={ isExample } />
            </div>
          ) }
        </div>
      </div>
    </>
  )
}

export default StellarPlot