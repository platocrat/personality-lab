// Externals
import * as d3 from 'd3'
import React, { useState, useEffect, useRef } from 'react'
// Locals
import { domainToFacetMapping, skillsMapping } from '@/utils/bessi/constants'



const PersonalityVisualization = ({ data, averages }) => {
  const svgRef = useRef<any>(null)
  const [activeDomain, setActiveDomain] = useState('Self-Management Skills')


  // Calculating averages is not depicted in this snippet
  const averageScore = averages[activeDomain]
  
  const calculateMidAngle = (index: number, total: number): number => {
    return ((index + 0.5) * 2 * Math.PI) / total - Math.PI / 2
  }


  useEffect(() => {
    if (!svgRef.current) return

    // Clear the current SVG
    d3.select(svgRef.current).selectAll('*').remove()

    const domainNames = Object.keys(data.domainScores)
    const facetNames = domainToFacetMapping[activeDomain]

    const width = 400
    const height = 450
    const outerRadius = 150
    const innerRadius = 100

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

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
      .attr('fill', (d) => d === activeDomain ? '#ccc' : '#ccc')
      .attr('stroke', 'white')
      // Make the active facet slightly opaque
      .attr('opacity', (d) => d === activeDomain ? 0.5 : 1)
      .style('cursor', 'pointer') // Change cursor to pointer on hover
      .on('click', (e, d) => setActiveDomain(d)) // corrected line
      .on('mouseover', function (event, d) {
        // Increase opacity on hover, but keep active facet distinct if it is 
        // the one being hovered
        d3.select(this).attr('opacity', d === activeDomain ? 0.4 : 0.7)
      })
      .on('mouseout', function (event, d) {
        // Reset opacity, maintaining active facet distinction
        d3.select(this).attr('opacity', d === activeDomain ? 0.5 : 1)
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
      .attr('fill', '#aaa')
      .attr('stroke', 'white')
      .on('mouseover', (e, d: any) => {
        tooltip.html(`
        <h3><strong>${d}</strong></h3>
        <div style="margin: 10px 0px 0px 0px;"/>
        Score: ${data.facetScores[d]}
        <div style="margin: 10px 0px 0px 0px;"/>
        ${skillsMapping.domains[activeDomain].facets[d]}
      `)
          .style('opacity', 1)
          .style('left', `${e.pageX + 10}px`)
          .style('top', `${e.pageY - 28}px`)
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0)
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

    // Active facet name
    svg.append('text')
      .attr('class', 'facet-name')
      .attr('text-anchor', 'middle')
      .attr('y', height / 2 - 20)
      .attr('font-size', '20px')
      .text(activeDomain)
  }, [activeDomain, data, averageScore])



  return (
    <div>
      <div 
        id='tooltip' 
        style={{
          opacity: 0,
          zIndex: 10,
          width: '300px',
          height: 'auto',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'left',
          position: 'absolute',
          pointerEvents: 'none',
          wordWrap: 'break-word',
          border: '1px solid #ddd',
          transition: 'opacity 0.2s',
          background: 'rgba(255, 255, 255, 0.9)',
        }}
      />
      <svg ref={ svgRef }></svg>
    </div>
  )
}

export default PersonalityVisualization
