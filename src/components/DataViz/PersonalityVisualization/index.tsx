// Externals
import * as d3 from 'd3'
import React, { useState, useEffect, useRef } from 'react'
// Locals
import Title from '../Title'
// Constants
import { DOMAIN_TO_FACET_MAPPING, getRangeLabel, rgbToRgba, SKILLS_MAPPING } from '@/utils'
// CSS
import dataVizStyles from '../DataViz.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/DataViz/PersonalityVisualization/PersonalityVisualization.module.css'



const PersonalityVisualization = ({
  isExample,
  data,
}) => {
  const d3Container = useRef<any>(null)
  const [ activeDomain, setActiveDomain ] = useState('Self-Management Skills')

  const title = `BESSI Personality Visualization`

  /**
   * @todo Fetch the results of the dataset from DynamoDB to obtain the average
   *       domain scores.
   */
  const averages = data.domainScores

  // Calculating averages is not depicted in this snippet
  const averageScore = averages[activeDomain]
  

  function calculateMidAngle(index: number, total: number): number {
    return ((index + 0.5) * 2 * Math.PI) / total - Math.PI / 2
  }

  // Function to determine color based on score
  const z = d3.scaleLinear<string>()
    .domain([0, 50, 100])
    .range(['#ff0000', '#ffff00', '#00ff00'])

  const getColorBasedOnScore = (score: number, isDomainScore?: boolean): string => {
    if (score >= 0 && score <= 100) {
      const color = z(score)
      const opacity = isDomainScore ? 1 : 0.6
      return rgbToRgba(color, opacity)
    }

    return '' // Default color for unexpected cases
  }


  useEffect(() => {
    if (!d3Container.current) return

    // Clear the current SVG
    d3.select(d3Container.current).selectAll('*').remove()

    const domainNames = Object.keys(data.domainScores)
    const facetNames = DOMAIN_TO_FACET_MAPPING[activeDomain]

    const width = 460
    const height = 480
    const outerRadius = 170
    const innerRadius = 120

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '-225 -220 450 470')
      .classed(dataVizStyles.svgContent, true)

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
      .append('foreignObject')
      .attr('class', 'outer-text')
      .attr(
        'x',
        (d, i) => (outerRadius + 15) * Math.cos(
          calculateMidAngle(i, domainNames.length)
        ) - 8
      )
      .attr(
        'y',
        (d, i) => (outerRadius + 15) * Math.sin(
          calculateMidAngle(i, domainNames.length)
        ) - 12
      )
      .attr('width', 18)
      .attr('height', 18)
      .html(
        (d) => `${data.domainScores[d]}`
      )

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
        tooltip
          .html(
            `
              <h3>
                <strong>
                  ${d}
                </strong>
              </h3>
              <div style="margin: 10px 0px 0px 0px"/>
              <div style="display: flex; flex-direction: row; gap: 12px;">
                <p>
                  Score: ${data.facetScores[d]}
                </p>
                <div style="width: max-content; background-color: ${ getColorBasedOnScore(data.facetScores[d], true)}; border-radius: 5px; padding: 0px 7.5px;">
                  <p style="color: white; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));">
                    ${getRangeLabel(data.facetScores[d]) }
                  </p>
                </div>
              </div>
              <div style="margin: 10px 0px 0px 0px"/>
              <div>
                <p>
                  ${SKILLS_MAPPING.domains[activeDomain].facets[d]}
                </p>
              </div>
            `
          )
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('opacity', 1)
          .style('left', `${e.x}px`)
          .style('top', `${e.y}px`)

        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .attr('transform', 'scale(0.9925)')
          .style('cursor', `pointer`)
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
        
        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .attr('transform', 'scale(1.0)')
      })

    // Add text to inner circle
    svg.selectAll('.inner-text')
      .data(facetNames)
      .enter()
      .append('foreignObject')
      .attr('class', 'inner-text')
      .attr(
        'x',
        (d, i) => (innerRadius + 15) * Math.cos(
          calculateMidAngle(i, facetNames.length)
        ) - 9
      )
      .attr(
        'y',
        (d, i) => (innerRadius + 15) * Math.sin(
          calculateMidAngle(i, facetNames.length)
        ) - 10.5
      )
      .attr('width', 18)
      .attr('height', 18)
      .html(
        (d: any) => `${data.facetScores[d]}`
      )

    // Apply the same drop-shadow filter to the inner paths (when you create them)
    svg.selectAll('.inner-path')
      .attr('filter', 'url(#drop-shadow)')

    // Text for the center
    svg.append('foreignObject')
      .attr('class', 'center-text')
      .attr('text-anchor', 'middle')
      .attr('x', -100)
      .attr('y', -44)
      .attr('width', 200)
      .attr('height', 63)
      .html(
        (d) => `
          <p style="font-size: 40px;">
            ${ data.domainScores[activeDomain] }
          </p>
        `
      )

    const domainScore: any = svg.append('foreignObject')
      .attr('width', 200)
      .attr('height', 63)
      .attr('x', -100)
      .attr('y', 14)
      .html(
        `
          <div style="display: flex; flex-direction: column; gap: 7px; justify-content: center; align-items: center;">
            <div style="width: max-content; background-color: ${ getColorBasedOnScore(data.domainScores[activeDomain], true)}; border-radius: 5px; padding: 0px 7.5px;">
              <p style="color: white; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));">
                ${getRangeLabel(data.domainScores[activeDomain]) }
              </p>
            </div>
            <div>
              <p style="font-size: 18px;">
                AVG: ${averageScore}
              </p>
          </div>
        `
      )

    // Active facet name in the center of the inner circle
    svg.append('foreignObject')
      .attr('class', 'facet-name')
      .attr('width', 200)
      .attr('height', 63)
      .attr('x', -100)
      .attr('y', -63) // Centered vertically inside the inner circle
      .html( // Reduced font size to fit the smaller area
        `
          <p style="font-size: 15px;">
            ${activeDomain}
          </p>
        `
      )

  }, [activeDomain, data, averageScore])



  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        } }
      >
        <Title isExample={ isExample } title={ title } />
        <div 
          ref={ d3Container } 
          className={ dataVizStyles.svgContainer }
        />
        <div
          id='tooltip' 
          className={ styles.tooltip }
        />
      </div>
    </>
  )
}

export default PersonalityVisualization
