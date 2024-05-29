// Externals
import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
// Locals
import Title from '../Title'
// Constants
import { domainToFacetMapping } from '@/utils'
// CSS
import styles from '../DataViz.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



/**
 * @dev Reference for this treemap component can be found at:
 * https://oec.world/en/profile/world/wld
 */
const TreeMap = ({
  isExample,
  data,
}) => {
  const d3Container = useRef<any>(null)
  const title = `BESSI Tree Map`



  const transformData = (originalData) => {
    const children = Object.entries(
      domainToFacetMapping
    ).map(([domain, facets]) => {
      const facetChildren = facets.map((facet: string) => {
        const facetName = facet
        const facetScore = originalData.facetScores[facet] || 0
        return { name: facetName, value: facetScore }
      }
      ).filter(facet => facet.value > 0) // Filter out facets with no score
      const domainScore = originalData.domainScores[domain] || 0
      return { name: domain, children: facetChildren, value: domainScore }
    })

    return { name: 'root', children }
  }

  const drawLegend = (svg, height: number, originalData) => {
    const svgWidth = 700 // Adjust based on your SVG setup
    let currentPositionX = 0
    let currentPositionY = 0 // Starting Y position for the first row of legend items
    const rowHeight = 30 // Height of a row, adjust based on your font size and padding
    const legendSpacing = 10 // Horizontal spacing between items
    const squareSize = 20 // Size of the legend color square
    const squareTextSpacing = 5 // Spacing between the square and the text

    const legend = svg.append('g')
      .attr('transform', `translate(50, ${height + 20})`)

    Object.entries(
      domainToFacetMapping
    ).forEach(([domain, _], index) => {
      const color: any = d3.scaleOrdinal().domain(
        Object.keys(domainToFacetMapping)
      ).range(d3.schemeCategory10)(domain)
      // Example to get score
      const score = originalData.domainScores[domain]
      const text = `${domain} (${score})`

      // Check if the current position plus estimated text width will exceed the SVG width
      const textWidthEstimate = text.length * 6 // Rough estimate, consider a more accurate measurement
      if (
        (currentPositionX + textWidthEstimate + squareSize + squareTextSpacing)
        > svgWidth
      ) {
        // Reset to the first column
        currentPositionX = 0
        // Move down to the next row
        currentPositionY += rowHeight
      }

      // Draw the square
      legend.append('rect')
        .attr('x', currentPositionX)
        .attr('y', currentPositionY)
        .attr('width', squareSize)
        .attr('height', squareSize)
        .style('fill', color)

      // Draw the text
      legend.append('text')
        .attr('x', currentPositionX + squareSize + squareTextSpacing)
        .attr('y', currentPositionY + squareSize / 2)
        .text(text)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle')

      currentPositionX += (textWidthEstimate + squareSize + squareTextSpacing + legendSpacing) // Update position for the next item
    })

    // Adjust the SVG height dynamically based on the number of rows
    const totalLegendHeight = currentPositionY + rowHeight // This assumes at least one row
    svg.attr('height', height + 40 + totalLegendHeight)
  }

  const drawTreeMap = (originalData) => {
    // Adjust bottom margin to accommodate legend
    const margin = { top: 10, right: 10, bottom: 100, left: 10 }
    const width = 800 - margin.left - margin.right
    const totalHeight = 600 // Initial total height
    // Adjusted for margins
    const height = totalHeight - margin.top - margin.bottom

    d3.select(d3Container.current).select('*').remove() // Clear the container

    /**
     * @todo d3.treemap() needs to use dynamic values for height and width
     */
    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 600 400')
      .classed(styles.svgContent, true)

    const root: any = d3.hierarchy(transformData(originalData))
      .sum((d: any) => d.value)
      .sort(
        (a: any, b: any) => b.height - a.height || b.value - a.value
      )

    /**
     * @todo d3.treemap() needs to use dynamic values for height and width
     */
    d3.treemap()
      .size([width, height])
      .paddingTop(24)
      .paddingRight(4)
      .paddingInner(4)(root)

    const color: any = d3.scaleOrdinal()
      .domain(transformData(originalData).children.map(d => d.name))
      // This will use 10 predefined colors adjust as needed
      .range(d3.schemeCategory10)

    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)

    const tooltip = d3.select('#tooltip')

    // Draw rectangles
    leaf.append('rect')
      .attr('id', (d: any) => (d.leafUid = d))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr(
        'fill',
        (d: any) => {
          while (d.depth > 1) d = d.parent
          return color(d.data.name)
        }
      )
      // Enable tooltip on `mouseover`
      .on('mouseover', function (e, d: any) {
        tooltip.style('display', 'block') // Show the tooltip
          .html(`
             <strong>${d.data.name}</strong><br/>
             Value: ${d.value}<br/>
           `) // Use HTML to format the content of the tooltip
        // Reduce the opacity for hover effect
        d3.select(this).style('opacity', 0.7)
      })
      .on('mousemove', function (e) {
        tooltip.style('left', (e.pageX + 10) + 'px') // Position the tooltip
          .style('top', (e.pageY + 10) + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('display', 'none') // Hide the tooltip
        // Reset the opacity when not hovering
        d3.select(this).style('opacity', 1)
      })

    // Domain name text and values and tooltips
    leaf.each(function (d: any) {
      const leafNode = d3.select(this as any)
      const rectWidth = d.x1 - d.x0
      const rectHeight = d.y1 - d.y0
      // Minimum size threshold for displaying text, adjust as needed
      const minSizeThreshold = 70
      const fontSize = Math.min(20, (rectWidth / d.data.name.length) * 2) // Example dynamic font size calculation

      if (rectWidth > minSizeThreshold && rectHeight > minSizeThreshold) {
        // Rectangle is big enough append domain name text
        leafNode.append('text')
          .attr('x', 4)
          .attr('y', 14)
          .attr('fill', 'white')
          .selectAll('tspan')
          // Split the domain name into words
          .data((d: any) => d.data.name.split(' '))
          .enter()
          .append('tspan')
          .attr('x', 4)
          .attr('y', (d, i, nodes) => 14 + i * 18) // This is where the domain name lines are set
          .text((d: any) => d)
          .style('font-size', `${fontSize}px`)

        // Rectangle is big enough append domain value text
        // Value should be at the bottom of the rectangle, so we use 
        // `rectHeight - 4` for the y attribute
        leafNode.append('text')
          .attr('x', 4)
          .attr('y', rectHeight - 4)
          .attr('fill', 'white')
          .text(d.data.value)
          // Here we are not basing the font-size of the value on the name's length so we can choose a fixed size
          // Or use a different dynamic calculation if desired
          .style('font-size', `${Math.min(20, rectWidth / 3)}px`)
      }

      // If the rectangle is too small, don't append the text or explicitly hide it
    })


    drawLegend(svg, height, originalData)
  }


  useEffect(() => {
    if (data && d3Container.current) {
      drawTreeMap(data)
    }
  }, [data])


  return (
    <>
      <Title isExample={ isExample } title={ title } />
      <div 
        ref={ d3Container } 
        style={ definitelyCenteredStyle } 
        className={ styles.svgContainer }
      />
      <div
        id='tooltip'
        style={ {
          display: 'none',
          padding: '10px',
          background: 'white',
          borderRadius: '5px',
          position: 'absolute',
          pointerEvents: 'none',
          border: '1px solid #ccc',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
        } }
      >
      </div>
    </>
  )
}

export default TreeMap