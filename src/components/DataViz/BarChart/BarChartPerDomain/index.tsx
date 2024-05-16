// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import Title from '../../Title'
import {
  FacetFactorType,
  findFacetByScore,
  skillDomainMapping,
  TargetDataStructure,
  domainToFacetMapping,
  SkillDomainFactorType,
  getSkillDomainAndWeight,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type BarChartPerDomainType = {
  isExample: boolean
  data: TargetDataStructure | {
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
  const d3Container = useRef(null)


  useEffect(() => {
    if (!d3Container.current) return

    // Remove any existing svgs to avoid duplicates
    d3.select(d3Container.current).selectAll('svg').remove()

    const svgWidth = 600
    const svgHeight = 400
    const margin = { top: 20, right: 120, bottom: 90, left: 50 }
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    console.log(`[BarChartPerDomain: useEffect()] data: `, data)


    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)


    const color = d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#ff0000', '#ffff00', '#00ff00'])


    const x0 = d3.scaleBand()
      .domain([(data as TargetDataStructure).name])
      .rangeRound([0, width])
      .paddingInner(0.1)

    const x1 = d3.scaleBand()
      .domain((data as TargetDataStructure).facets.map(d => d.name))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.25)

    const y = d3.scaleLinear()
      .domain([0, 100]) // Assuming scores range from 0 to 100
      .nice()
      .rangeRound([height, 0])

    // Create a tooltip
    const tooltip = d3.select(d3Container.current).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid #d3d3d3')
      .style('padding', '10px')
      .style('border-radius', '5px')

    const g = svg.append('g')

    g.selectAll('rect')
      .data((data as TargetDataStructure).facets)
      .join('rect')
      .attr('x', (d, i) => x1(d.name)!)
      .attr('y', d => y(d.score))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0)! - y(d.score))
      .attr('fill', d => color(d.score))
      .on('mouseover', function (event, d) {
        tooltip.style('opacity', 1)
        d3.select(this).style('stroke', 'black').style('opacity', 0.8)
      })
      .on('mousemove', function (event, d: any) {
        tooltip
          .html(`Facet: ${d.name}<br/>Score: ${d.score}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseleave', function () {
        tooltip.style('opacity', 0)
        d3.select(this).style('stroke', 'none').style('opacity', 1)
      })

    // Add facet score labels to the top of each bar
    g.selectAll('.bar-label')
      .data((data as TargetDataStructure).facets)
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

    const legendTitle = legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .text('Domain Score:')

    const domainScore: any = legend.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .text((data as TargetDataStructure).domainScore)
      // Set the color here
      .attr('fill', color((data as TargetDataStructure).domainScore))
      .attr('transform', 'translate(12,5)')
    
    const scoreRangeText: any = legend.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .text(`Score Range`)
      .attr('transform', 'translate(12,50)')

    const textBBox = domainScore.node().getBBox()

    legend.insert('rect', 'text')
      .attr('x', textBBox.x - 3) // Add some padding
      .attr('y', textBBox.y - 3) // Add some padding
      .attr('width', textBBox.width + 30) // Add some padding
      .attr('height', textBBox.height + 4) // Add some padding
      .attr('fill', 'black') // Set the background color
      .attr('rx', 5) // Rounded corners
      .attr('ry', 5) // Rounded corners
      .attr('transform', 'translate(0,5)')

    const legendGradient = legend.append('g')
      .attr('class', 'legend-gradient')
      .attr('transform', 'translate(0,71)')

    legendGradient.append('rect')
      .attr('width', 20)
      .attr('height', 200)
      .style('fill', 'url(#gradient)')

    const legendScale = d3.scaleLinear()
      .domain([0, 100])
      .range([200, 0])

    const legendAxis = legend.append('g')
      .attr('class', 'legend-axis')
      .attr('transform', 'translate(20,71)')
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
      <h4 
        style={{ 
          ...definitelyCenteredStyle,
          margin: '12px 0px 4px 0px',
        }}
      >
        { (data as TargetDataStructure).name }
      </h4>
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}


export default BarChartPerDomain
