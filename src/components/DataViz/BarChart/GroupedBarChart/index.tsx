// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import Title from '../../Title'
import {
  Facet,
  transformData,
  FacetFactorType,
  findFacetByScore,
  skillDomainMapping,
  domainToFacetMapping,
  SkillDomainFactorType,
  getSkillDomainAndWeight,
  BASELINE_NUMBER_OF_FACETS,
  generateHighContrastColors,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



export type FacetDataType = { name: string, score: number }

export type InputDataStructure = {
  domainScores: { [ key: string ]: number }
  facetScores: { [key: string]: number }
}


export type TargetDataStructure = {
  name: string           // The label for the group on the x-axis
  domainScore: number    // The value to assign next to each domain name in legend
  facetScores: number[]  // The height or value of the bar
  facets: {
    name: string         // The label for the individual bar within the group
    score: number        // The height or value of the bar
  }[]
}


type GroupedBarChartType = {
  isExample: boolean
  data: InputDataStructure | {
    axis: string
    value: number
  }[] | {
    axis: string
    value: number
  }
}




const GroupedBarChart: FC<GroupedBarChartType> = ({ 
  data,
  isExample, 
}) => {
  const d3Container = useRef(null)
  const title = 'BESSI Bar Chart'


  const margin = { top: 40, right: 20, bottom: 90, left: 90 }
  const width = 700 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom


  // const transformedData = transformData(data as InputDataStructure)
  // console.log(`transformedData: `, transformedData)
  
  const _data = transformData(data as InputDataStructure)



  useEffect(() => {
    if (!d3Container.current) return

    // Remove any existing svg to avoid duplicates
    d3.select(d3Container.current).select('svg').remove()

    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = 650 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const domains = _data.map(d => d.name)

    const x0 = d3.scaleBand()
      .domain(domains)
      .rangeRound([0, width])
      .paddingInner(0.72)

    const x1 = d3.scaleBand()
      .domain(['facetScores'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.51)

    const yMax = d3.max(_data, d => d3.max(d.facetScores))!

    const y = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .rangeRound([height, 0])


    // const uniqueColors = generateHighContrastColors(BASELINE_NUMBER_OF_FACETS)

    const color = d3.scaleOrdinal<string>()
      .domain(_data.flatMap(
        d => d.facetScores.map(
          (_, i) => i.toString()))
      )
      .range([...Array(_data.reduce(
        (max, d) => Math.max(max, d.facetScores.length), 0))
      ].map((_, i) => d3.interpolateRainbow(i / _data.length)));


    // Create a tooltip
    const tooltip = d3.select(d3Container.current).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'white')
      .style('border', '1px solid #d3d3d3')
      .style('padding', '10px')
      .style('border-radius', '5px')
    

    svg.append('g')
      .selectAll('g')
      .data(_data)
      .join('g')
      .attr('transform', d => `translate(${x0(d.name)},0)`)
      .selectAll('rect')
      .data(
        (d: any) => d.facetScores.map(
          (value, index) => ({ value, index })
        )
      )
      .join('rect')
      .attr('x', (d: any) => x1('facetScores')! * d.index)
      .attr('y', (d: any) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', (d: any) => y(0)! - y(d.value))
      .attr('fill', (_: any, i) => color((i * _.value).toString()))
      .on('mouseover', function (event, d) {
        tooltip.style('opacity', 1)
        d3.select(this).style('stroke', 'black').style('opacity', 0.8)
      })
      .on('mousemove', function (event, d: any) {
        const currentFacet = findFacetByScore(_data, d.value, d.index)
        const facetName = currentFacet ? currentFacet.name : ''
        const facetScore = currentFacet ? currentFacet.score : ''

        tooltip
          .html(`Facet: ${facetName}<br/>Score: ${facetScore}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseleave', function (event, d) {
        tooltip.style('opacity', 0)
        d3.select(this).style('stroke', 'none').style('opacity', 1)
      })

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))

    svg.append('g')
      .call(d3.axisLeft(y))

  }, [data])


  return (
    <>
      <Title isExample={ isExample } title={ title } />
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}


export default GroupedBarChart
