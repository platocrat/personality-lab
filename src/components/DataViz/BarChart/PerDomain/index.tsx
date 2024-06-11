// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import Title from '@/components/DataViz/Title'
import {
  getRangeLabel,
  FacetFactorType,
  findFacetByScore,
  skillDomainMapping,
  domainToFacetMapping,
  SkillDomainFactorType,
  BarChartTargetDataType,
  getSkillDomainAndWeight,
} from '@/utils'
// CSS
import styles from '@/components/DataViz/DataViz.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type BarChartPerDomainType = {
  isExample: boolean
  data: BarChartTargetDataType | {
    axis: string
    value: number
  }[] | {
    axis: string
    value: number
  }
}



const BarChartPerDomain: FC<BarChartPerDomainType> = ({
  data,
  isExample,
}) => {
  const d3Container = useRef<HTMLDivElement | null>(null)


  useEffect(() => {
    if (!d3Container.current) return

    // Remove any existing svgs to avoid duplicates
    d3.select(d3Container.current).selectAll('svg').remove()

    const svgWidth = 600
    const svgHeight = 400
    const margin = { top: 20, right: 83, bottom: 70, left: 50 }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom


    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '-50 -10 605 400')
      .classed(styles.svgContent, true)


    const color = d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#ff0000', '#ffff00', '#00ff00'])


    const x0 = d3.scaleBand()
      .domain([(data as BarChartTargetDataType).name])
      .rangeRound([0, width])
      .paddingInner(0.1)

    const x1 = d3.scaleBand()
      .domain((data as BarChartTargetDataType).facets.map(d => d.name))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.25)

    const y = d3.scaleLinear()
      .domain([0, 100]) // Assuming scores range from 0 to 100
      .nice()
      .rangeRound([height, 0])

    // Create a tooltip
    const tooltip = d3.select(d3Container.current).append('div')
      /**
       * @todo Tooltip is not being displayed
       */
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'fixed')
      .style('background', 'white')
      .style('text-align', 'left')
      .style('border', '1px solid #d3d3d3')
      .style('padding', '10px')
      .style('border-radius', '8px')
      .style('z-index', '100px')

    const g = svg.append('g')

    g.selectAll('rect')
      .data((data as BarChartTargetDataType).facets)
      .join('rect')
      .attr('x', (d, i) => x1(d.name)!)
      .attr('y', d => y(d.score))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0)! - y(d.score))
      .attr('fill', d => color(d.score))
      /**
       * @todo Tooltip is not being displayed
       */
      .on('mouseover', function (event, d) {
        tooltip.style('opacity', 1)
        
        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('stroke', 'black')
          .style('opacity', 0.8)
          .style('cursor', 'pointer')
      })
      .on('mousemove', function (event, d: any) {
        tooltip
          .html(
            `
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex;">
                  <p style="margin-right: 4px;">
                    Facet:
                  </p>
                  <p>
                    ${d.name}
                  </p>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <p style="margin-right: 4px;">
                    Score:
                  </p>
                  <div style="display: flex; flex-direction: row; gap: 12px; justify-content: left; align-items: left;">
                    <div>
                      <p>
                      ${ d.score }
                      </p>
                    </div>
                    <div style="width: max-content; background-color: ${color(d.score)}; border-radius: 5px; padding: 0px 7.5px;">
                      <p style="color: white; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));">
                        ${getRangeLabel(d.score) }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            `
          )
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('left', (event.x) + 'px')
          .style('top', (event.y) + 'px')
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0)
        
        d3.select(this)
          .transition()
          .duration(100) // Duration of the transition in milliseconds
          .style('stroke', 'none')
          .style('opacity', 1)
      })

    // Add facet score labels to the top of each bar
    g.selectAll('.bar-label')
      .data((data as BarChartTargetDataType).facets)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (d, i) => x1(d.name)! + x1.bandwidth() / 2)
      .attr('y', d => y(d.score) - 5)
      .text(d => d.score)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'black')

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x1))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .attr('transform', 'rotate(-25)')

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5))

    // Legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 20},20)`)

    const legendTitle = legend.append('foreignObject')
      .attr('width', 120)
      .attr('height', 50)
      .attr('x', -14.15)
      .attr('y', -20)
      .html(
        `
          <p style="font-size: 16px;">Domain Score: </p>
        `
      )

    const domainScore: any = legend.append('foreignObject')
      .attr('width', 120)
      .attr('height', 40)
      .attr('x', 0)
      .attr('y', 8)
      .html(
        `
          <div style="display: flex; flex-direction: row; gap: 8px; justify-content: left; align-items: left;">
            <div>
              <p style="font-size: 16px;">
                <strong>
                  ${ (data as BarChartTargetDataType).domainScore }
                </strong>
              </p>
            </div>
            <div style="width: max-content; background-color: ${ color((data as BarChartTargetDataType).domainScore) }; border-radius: 5px; padding: 0px 7.5px;">
              <p style="color: white; font-size: 14px; font-weight: 800; filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));">
                ${ getRangeLabel((data as BarChartTargetDataType).domainScore) }
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
    
    const scoreRangeText: any = legend.append('text')
      .attr('x', 0)
      .attr('y', 30)
      .text(`Score Range`)
      .style('font-size', '16px')
      .attr('transform', 'translate(0,45)')

    const legendGradient = legend.append('g')
      .attr('class', 'legend-gradient')
      .attr('transform', 'translate(0,90)')

    legendGradient.append('rect')
      .attr('width', 20)
      .attr('height', 200)
      .style('fill', 'url(#gradient)')

    const legendScale = d3.scaleLinear()
      .domain([0, 100])
      .range([200, 0])

    const legendAxis = legend.append('g')
      .attr('class', 'legend-axis')
      .attr('transform', 'translate(20,90)')
      .call(d3.axisRight(legendScale).ticks(5))

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'gradient')
      .attr('gradientTransform', 'rotate(90)')
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color(100))
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color(0))

  }, [data])



  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column',
        } }
      >
        <h4 
          style={{ 
            ...definitelyCenteredStyle,
            margin: '12px 0px 4px 0px',
          }}
        >
          { (data as BarChartTargetDataType).name }
        </h4>
        <div 
          ref={ d3Container } 
          className={ styles.svgContainer }
          style={{ ...definitelyCenteredStyle, maxWidth: '700px' }}
        />
      </div>
    </>
  )
}


export default BarChartPerDomain
