// Externals
import * as d3 from 'd3'
import React, { useState, useEffect, useRef } from 'react'
// Locals
import { domainToFacetMapping, skillsMapping } from '@/utils/bessi/constants'
// CSS
import styles from '@/components/DataViz/PersonalityVisualization/PersonalityVisualization.module.css'



const PersonalityVisualization = ({ data, averages }) => {
  const svgRef = useRef<any>(null)
  const [ activeDomain, setActiveDomain ] = useState('Self-Management Skills')


  // Calculating averages is not depicted in this snippet
  const averageScore = averages[activeDomain]
  

  function calculateMidAngle(index: number, total: number): number {
    return ((index + 0.5) * 2 * Math.PI) / total - Math.PI / 2
  }

  // Function to determine color based on score
  const getColorBasedOnScore = (score: number): string => {
    if (score >= 0 && score < 20) return '#e9967a' // Soft Red
    else if (score >= 20 && score < 40) return '#f9cb9c' // Soft Orange
    else if (score >= 40 && score < 60) return '#ffe599' // Soft Yellow
    else if (score >= 60 && score < 80) return '#b6d7a8' // Soft Lime Green
    else if (score >= 80 && score <= 100) return '#98fb98' // Soft Green
    else return '' // Default white color for unexpected cases
  }


  useEffect(() => {
    if (!svgRef.current) return

    // Clear the current SVG
    d3.select(svgRef.current).selectAll('*').remove()

    const domainNames = Object.keys(data.domainScores)
    const facetNames = domainToFacetMapping[activeDomain]

    const width = 430
    const height = 450
    const outerRadius = 170
    const innerRadius = 120

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    // Define the drop-shadow filter
    const defs = svg.append('defs')

    const dropShadowFilter = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%') // To ensure the shadow is not clipped

    // Standard Gaussian blur
    dropShadowFilter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 1) // This value is the blur amount
      .attr('result', 'blur')

    // Offset the blur and the color
    dropShadowFilter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 0) // Horizontal offset
      .attr('dy', 1) // Vertical offset
      .attr('result', 'offsetBlur')

    // Create the color and opacity for the shadow
    const feMerge = dropShadowFilter.append('feMerge')
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic') // This ensures the shape’s fill is maintained

    // Create the outer circle for facet scores
    const outerCircle: any = d3.arc()
      .innerRadius(outerRadius + 30)
      .outerRadius(outerRadius)
      .startAngle((d, i) => (i * 2 * Math.PI) / domainNames.length)
      .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / domainNames.length)

    svg.selectAll('.outer-path')
      .data(domainNames)
      .enter()
      .append('path')
      .attr('class', 'outer-path')
      .attr('d', outerCircle)
      // Apply color based on score
      .attr(
        'fill', 
        (d: any) => getColorBasedOnScore(data.domainScores[d])
      )
      // Soft blue for active, white for others
      .attr(
        'stroke', 
        (d) => d === activeDomain ? '#ADD8E6' : 'white'
      )
      // Emphasize active domain
      .attr('stroke-width', (d) => d === activeDomain ? 3 : 1)
      .style('cursor', 'pointer') // Change cursor to pointer on hover
      .on('click', (e, d) => setActiveDomain(d)) // corrected line
      .on('mouseover', function (event, d) {
        // Increase opacity on hover, but keep active facet distinct if it is 
        // the one being hovered
        d3.select(this).attr('opacity', d === activeDomain ? 0.8 : 0.7)
        d3.select(this).attr('transform', 'scale(0.9895)')
      })
      .on('mouseout', function (event, d) {
        // Reset opacity, maintaining active facet distinction
        d3.select(this).attr('opacity', d === activeDomain ? 0.9 : 1)
        d3.select(this).attr('transform', 'scale(1.0)')
      })

    // Add text to outer circle
    svg.selectAll('.outer-text')
      .data(domainNames)
      .enter()
      .append('text')
      .attr('class', 'outer-text')
      .attr(
        'x',
        (d, i) => (outerRadius + 15) * Math.cos(
          calculateMidAngle(i, domainNames.length)
        )
      )
      .attr(
        'y',
        (d, i) => (outerRadius + 15) * Math.sin(
          calculateMidAngle(i, domainNames.length)
        )
      )
      .attr('text-anchor', 'middle')
      .text((d) => data.domainScores[d])

    // Apply the drop-shadow filter to the outer paths
    svg.selectAll('.outer-path')
      .attr('filter', 'url(#drop-shadow)')

    // Create the inner circle for domain scores
    const innerCircle: any = d3.arc()
      .innerRadius(innerRadius + 30)
      .outerRadius(innerRadius)
      .startAngle((d, i) => (i * 2 * Math.PI) / facetNames.length)
      .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / facetNames.length)
    
    const tooltip = d3.select('#tooltip')

    svg.selectAll('.inner-path')
      .data(facetNames)
      .enter()
      .append('path')
      .attr('class', 'inner-path')
      .attr('d', innerCircle)
      // Apply color based on score
      .attr(
        'fill', 
        (d: any) => getColorBasedOnScore(data.facetScores[d])
      )
      .attr('stroke', 'white')
      .on('mouseover', function (e, d: any) {
        tooltip.html(`
        <h3><strong>${d}</strong></h3>
        <div style="margin: 10px 0px 0px 0px"/>
        Score: ${data.facetScores[d]}
        <div style="margin: 10px 0px 0px 0px"/>
        ${skillsMapping.domains[activeDomain].facets[d]}
      `)
          .style('opacity', 1)
          .style('left', `${e.pageX + 10}px`)
          .style('top', `${e.pageY - 28}px`)

        d3.select(this).attr('transform', 'scale(0.9925)')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
        d3.select(this).attr('transform', 'scale(1.0)')
      })

    // Add text to inner circle
    svg.selectAll('.inner-text')
      .data(facetNames)
      .enter()
      .append('text')
      .attr('class', 'inner-text')
      .attr(
        'x',
        (d, i) => (innerRadius + 15) * Math.cos(
          calculateMidAngle(i, facetNames.length)
        )
      )
      .attr(
        'y',
        (d, i) => (innerRadius + 15) * Math.sin(
          calculateMidAngle(i, facetNames.length)
        )
      )
      .attr('text-anchor', 'middle')
      .text((d: any) => data.facetScores[d])

    // Apply the same drop-shadow filter to the inner paths (when you create them)
    svg.selectAll('.inner-path')
      .attr('filter', 'url(#drop-shadow)')

    // Text for the center
    svg.append('text')
      .attr('class', 'center-text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '48px')
      .text(data.domainScores[activeDomain])

    // Text for the average score
    svg.append('text')
      .attr('class', 'average-text')
      .attr('text-anchor', 'middle')
      .attr('y', 30)
      .attr('font-size', '18px')
      .text(`AVG: ${averageScore}`)

    // Active facet name in the center of the inner circle
    svg.append('text')
      .attr('class', 'facet-name')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px') // Reduced font size to fit the smaller area
      .attr('y', -50) // Centered vertically inside the inner circle
      .text(activeDomain)

  }, [activeDomain, data, averageScore])



  return (
    <div>
      <div 
        id='tooltip' 
        className={ styles.tooltip }
      />
      <svg ref={ svgRef }></svg>
    </div>
  )
}

export default PersonalityVisualization
