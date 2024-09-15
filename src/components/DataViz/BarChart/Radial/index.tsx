// Externals
import * as d3 from 'd3'
import React, { FC, useEffect, useRef } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
// Utils
import { BarChartTargetDataType, getRangeLabel } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/components/DataViz/BarChart/Radial/Radial.module.css'



type RadialBarChartProps = {
  data: BarChartTargetDataType
  selectedRadialBarChart: number
}



const RadialBarChart: FC<RadialBarChartProps> = ({
  data,
  selectedRadialBarChart,
}) => {
  // Refs
  const d3Container = useRef<any>(null)


  useEffect(() => {
    d3.select(d3Container.current).selectAll('svg').remove()

    const margin = { top: 30, right: 50, bottom: 20, left: 10 }
    const width = 470
    const height = 420
    const innerRadius = 120
    const outerRadius = Math.min(width, height) / 2.2

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '-213 -230 420 470')
      .classed(dataVizStyles.svgContent, true)

    const x = d3.scaleBand()
      .domain(data.facets.map(d => d.name))
      .range([0, 2 * Math.PI])
      .align(0)

    const y = d3.scaleRadial()
      .domain([0, d3.max(data.facetScores)!])
      .range([innerRadius, outerRadius])

    const z = d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#ff0000', '#ffff00', '#00ff00'])

    // Create a tooltip
    const tooltip = d3.select('#tooltip')

    svg.append('g')
      .selectAll('path')
      .data(data.facets)
      .join('path')
      .attr('fill', (d: any) => z(d.score))
      .attr('opacity', '0.75')
      .attr('d', (d3.arc() as any)
        .innerRadius(innerRadius)
        .outerRadius(d => y(d.score))
        .startAngle(d => x(d.name))
        .endAngle(d => (x(d.name) as number) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)
      )
      .on('mouseover', function (event, d) {
        tooltip
          .html(
            `
            <div>
              <strong>
                ${d.name}
              </strong>
              <br/>
              <div style="display: flex; gap: 10px">
                <div>
                  ${ `Score: ${ d.score }` }
                </div>
                <div style="background-color: ${ z(d.score) }; border-radius: 5px; padding: 0px 7.5px;">
                  <p style="color: white; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.85));">
                    ${ getRangeLabel(d.score) }
                  </p>
                </div>
              </div>
            </div>
            `
          )
          .transition()
          .duration(100)
          .style('opacity', 1)
          .style('left', (event.x) + 'px')
          .style('top', (event.y) + 'px')
        
        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('stroke', 'black')
          .style('stroke-width', '2px')
          .style('cursor', `pointer`)
      })
      .on('mouseout', function () {
        tooltip
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('opacity', 0)

        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('stroke', 'none')
          .style('stroke-width', '0')
      })

    svg.append('foreignObject')
      .attr('width', 200)
      .attr('height', 50)
      .attr('x', -100)
      .attr('y', data.name === 'Emotional Resilience Skills' ? -57 : -47)
      .html(
        `
        <div style="text-align: center; font-size: 17.5px;">
          <div>
            ${ data.name }
          </div>
        </div>
        `
      )

    const domainScore: any = svg.append('foreignObject')
      .attr('width', 200)
      .attr('height', 63)
      .attr('x', -100)
      .attr('y', data.name === 'Emotional Resilience Skills' ? -8 : -22)
      .html(
        `
          <div style="display: flex; flex-direction: column; gap: 3px; justify-content: center; align-items: center;">
            <p style="font-size: 28px;">
              ${data.domainScore}
            </p>
            <div style="background-color: ${ z(data.domainScore)}; border-radius: 5px; padding: 0px 7.5px;">
              <p style="color: white; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));">
                ${getRangeLabel(data.domainScore) }
              </p>
            </div>
          </div>
        `
      )

    // Add drop shadow filter
    svg.append('defs')
      .append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%')
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 1.25)
      .attr('stdDeviation', 1)
      .attr('flood-color', '#000000')
      .attr('flood-opacity', '0.75')

    // Add rings with labels
    const ringsData = [0, 50, 100] // Adjust the values as needed

    svg.selectAll('.ring')
      .data(ringsData)
      .enter()
      .append('circle')
      .attr('class', 'ring')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => y(d))
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-dasharray', '2,2')

    svg.selectAll('.ring-label')
      .data(ringsData)
      .enter()
      .append('text')
      .attr('class', 'ring-label')
      .attr('x', 0)
      .attr('y', d => -y(d))
      .attr('dy', -4)
      .attr('text-anchor', 'middle')
      .text(d => `${d}`)
      .style('opacity', '0.25')
  }, [data, selectedRadialBarChart])



  return (
    <>
      <div
        ref={ d3Container }
        style={{ maxWidth: '450px' }}
        className={ dataVizStyles.svgContainer }
      >
        <div
          id='tooltip'
          className={ styles.tooltip }
        />
      </div>
    </>
  )
}


export default RadialBarChart
