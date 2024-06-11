// Externals
import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
// Locals
// CSS
// import './Histogram.css'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import histogramStyles from '@/components/DataViz/Histograms/Single/Histogram.module.css'


const Histogram = ({ data, title, score }) => {
  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      // Clear previous contents
      d3.select(d3Container.current).selectAll('*').remove()

      const margin = { top: 20, right: 30, bottom: 30, left: 40 }
      const width = 650 - margin.left - margin.right
      const height = 350 - margin.top - margin.bottom

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '-45 -30 650 375')
        .classed(dataVizStyles.svgContent, true)

      const x = d3.scaleLinear()
        .domain(d3.extent(data) as any)
        .range([0, width])

      const bins = d3.bin()
        .domain(x.domain() as any)
        .thresholds(x.ticks(50))(data)

      const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)] as any)
        .range([height, 0])

      const tooltip = d3
        // .select('#tooltip')
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('text-align', 'center')
        .style('width', 'auto')
        .style('height', 'auto')
        .style('padding', '8px')
        .style('font', '12px sans-serif')
        .style('background', 'lightsteelblue')
        .style('border', '1px solid #aaa')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('opacity', 0)

      svg.selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
        .attr('x', 1)
        .attr('transform', (d: any) => `translate(${x(d.x0)},${y(d.length)})`)
        .attr('width', (d: any) => x(d.x1) - x(d.x0) - 1)
        .attr('height', d => height - y(d.length))
        .style('fill', 'lightblue')
        .style('cursor', 'pointer')
        .on('mouseover', function (event, d: any) {
          d3.select(this).style('fill', 'darkblue')
          
          tooltip
            .transition()
            .duration(200)
            .style('opacity', .9)
          
          tooltip
            .html(
              `Range: ${d.x0.toFixed(2)} - ${d.x1.toFixed(2)}
              <br>
              Count: ${d.length}`
            )
            /**
             * @todo Position `left` and `top` over-expand the window width when
             *      the tooltip is shown on a mobile-sized window
             */
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).style('fill', 'lightblue')
          
          tooltip
            .transition()
            .duration(500)
            .style('opacity', 0)
        })

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))

      svg.append('g')
        .call(d3.axisLeft(y))

      svg.append('foreignObject')
        .attr('width', 400)
        .attr('height', 22)
        .attr('x', 80)
        .attr('y', -33.5)
        .html(
          `
            <p style="font-size: 16.5px; font-weight: bold; text-align: center;">
              ${title}
            </p>
          `
        )

      svg.append('line')
        .attr('x1', x(score))
        .attr('x2', x(score))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'red')
        .attr('stroke-width', 2)

      const scoreTooltip = d3
        // .select('#scoreTooltip')
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('text-align', 'center')
        .style('width', '100px')
        .style('height', '28px')
        .style('padding', '2px')
        .style('font', '12px sans-serif')
        .style('background', 'lightcoral')
        .style('border', '0px')
        .style('border-radius', '8px')
        .style('pointer-events', 'none')
        .style('opacity', 0)

      const circleGroup = svg
        .append('g')
        .attr('class', histogramStyles['circle-group'])

      circleGroup.append('circle')
        .attr('cx', x(score))
        .attr('cy', 0)
        .attr('r', 6)
        .attr('fill', 'red')
        .attr('stroke', 'darkred')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', 'darkred')
            scoreTooltip
              .transition()
              .duration(200)
              .style('opacity', .9)
        })
        .on('mousemove', function (event, d) {
          scoreTooltip
            .html(`User's Score: ${score.toFixed(2)}`)
            /**
             * @todo Position `left` and `top` over-expand the window width when
             *      the tooltip is shown on a mobile-sized window
             */
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`)
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', 'red')
          
          scoreTooltip
            .transition()
            .duration(500)
            .style('opacity', 0)
        })

      circleGroup.append('circle')
        .attr('class', histogramStyles.beacon)
        .attr('cx', x(score))
        .attr('cy', 0)
        .attr('r', 10)
        .style('fill', 'none')
        .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('opacity', 0)
        .style('pointer-events', 'none')
    }
  }, [data, title, score])

  return (
    <>
      {/* <div 
        ref={ d3Container }
        style={{ maxWidth: '700px' }}
        className={ dataVizStyles.svgContainer }
      >
        <div
          id='tooltip'
          className={ histogramStyles.tooltip }
        />
        <div
          id='scoreTooltip'
          className={ histogramStyles.scoreTooltip }
        />
      </div> */}
      <div
        ref={ d3Container }
        style={{ maxWidth: '700px' }}
        className={ dataVizStyles.svgContainer }
      />
    </>
  )
}

export default Histogram