// Externals
import * as d3 from 'd3'
import React, { FC, useEffect, useRef } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
// Utils
import { TargetDataStructure } from '@/utils'
// CSS
import styles from '@/components/DataViz/BarChart/Radial/Radial.module.css'



type RadialBarChartProps = {
  isExample: boolean
  data: TargetDataStructure
  selectedRadialBarChart: number
}




const RadialBarChart: FC<RadialBarChartProps> = ({
  data,
  isExample,
  selectedRadialBarChart,
}) => {
  const d3Container = useRef<SVGSVGElement | null>(null)
  const TITLE = `BESSI Radial Bar Chart`


  useEffect(() => {
    d3.select(d3Container.current).selectAll('*').remove()

    const width = 400
    const height = 400
    const innerRadius = 80
    const outerRadius = Math.min(width, height) / 2.2

    const svg = d3.select(d3Container.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

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
      .on('mouseover', (event, d) => {
        tooltip.style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .html(
            `
            <div>
              <strong>
                ${d.name}
              </strong>
              <br/>
              <p>
                Score: ${d.score}
              </p>
            </div>
            `
          )
          .transition()
          .duration(50)
          .style('opacity', 1)
      })
      .on('mouseleave', () => {
        tooltip.transition()
          .duration(1)
          .style('opacity', 0)
      })

    svg.append('foreignObject')
      .attr('width', 200)
      .attr('height', 50)
      .attr('x', -100)
      .attr('y', -27)
      .html(
        `
        <div style="text-align: center; font-size: 14.5px;">
          <p>
            ${ data.name.slice(0, data.name.indexOf('Skills')) }
          </p>
          <p>
            ${ data.name.slice(data.name.indexOf('Skills')) }
          </p>
        </div>
        `
      )

    const domainScore: any = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('z-index', '10')
      .style('font-size', '18px')
      .text(data.domainScore)
      .attr('fill', z((data as TargetDataStructure).domainScore))
      .style('filter', 'url(#drop-shadow)') // Apply drop shadow filter
      .attr('y', 38.5)

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

    const textBBox = domainScore.node().getBBox()

    svg.insert('rect', 'text')
      .attr('x', textBBox.x - 8.5) // Add some padding
      .attr('y', textBBox.y - 6.25) // Add some padding
      .attr('width', textBBox.width + 17.25) // Add some padding
      .attr('height', textBBox.height + 3) // Add some padding
      .attr('fill', '#555555') // Set the background color
      .attr('rx', 5) // Rounded corners
      .attr('ry', 5) // Rounded corners
      .attr('transform', 'translate(0,5)')

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
      <Title isExample={ isExample } title={ TITLE } />
      <svg ref={ d3Container } />
      <div
        id='tooltip'
        className={ styles.tooltip }
      />
    </>
  )
}


export default RadialBarChart
