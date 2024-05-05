// Externals
import * as d3 from 'd3'
import { FC, useEffect, useRef } from 'react'
// Locals
import Title from '../Title'
import {
  Facet,
  FacetFactorType,
  skillDomainMapping,
  SkillDomainFactorType,
  getSkillDomainAndWeight,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'


type BarChartType = {
  isExample: boolean
  data: {
    domainScores: SkillDomainFactorType
    facetScores: FacetFactorType
  } | {
    axis: string
    value: number
  }[] | {
    axis: string
    value: number
  }
}



const BarChart: FC<BarChartType> = ({ isExample, data }) => {
  const d3Container = useRef(null)
  const title = 'BESSI Bar Chart'



  useEffect(() => {
    if (data && d3Container.current) {
      // Create a mapping from domain names to domain data
      const domainMap = Object.entries(
        (data as {
          domainScores: SkillDomainFactorType,
          facetScores: FacetFactorType
        }
        ).domainScores).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              domainName: key + ` (${value})`, // Append the domain score to the domain name
              domainScore: value,
              facetScores: [] // Array to hold facet scores for this domain
            }
            return acc
          }, {})


      // Assign facet scores to the correct domain
      Object.entries((data as {
        domainScores: SkillDomainFactorType,
        facetScores: FacetFactorType
      }).facetScores).forEach(
        ([key, value]) => {
          const domainInfo = getSkillDomainAndWeight(key as Facet)

          console.log(`${key}: ${value}`)

          domainInfo.domain.forEach(domain => {
            if (domainMap[domain]) { // Ensure the domain exists in the domainMap
              domainMap[domain].facetScores.push({
                facetName: key,
                facetScore: value
              })
            } else {
              // Log error if domain not found
              console.error('Domain not found in domainScores: ', domain)
            }
          })
        })

      // Convert the domain map to an array for D3 processing
      const domainArray = Object.values(domainMap)


      const margin = { top: 20, right: 30, bottom: 50, left: 90 }
      const width = 450 - margin.left - margin.right
      const height = 425 - margin.top - margin.bottom

      d3.select(d3Container.current).selectAll('*').remove()

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right + 100)
        .attr('height', height + margin.top + margin.bottom + 55)
        .append('g')
        // .attr('transform', `translate(${margin.left + 400}, ${margin.top})`)
        .attr('transform', `rotate(90), translate(${45}, ${-margin.top - 460})`)


      // Setup the x-axis
      const x0 = d3.scaleBand()
        .rangeRound([0, width + 100])
        // .paddingInner(0.01) // Less padding means more space for bars
        .paddingOuter(0.01) // Less padding means more space for bars
        .domain(domainArray.map((d: any) => d.domainName))

      const x1 = d3.scaleBand()
        .paddingInner(4) // Ensure facets are visible by adjusting padding
        .paddingOuter(0)
        .domain(domainArray.flatMap(
          (d: any) => d.facetScores.map((f: any) => f.facetName)
        ))
        .rangeRound([0, x0.bandwidth()])


      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .attr('transform', 'translate(-11, 12)rotate(-120)')
        .style('text-anchor', 'end')
        .attr('font-size', '10px')

      // Setup the y-axis
      const y = d3.scaleLinear()
        .domain(
          [
            0,
            d3.max(
              domainArray.flatMap(
                (d: any) => d.facetScores),
              (f: any) => f.facetScore
            )
          ]
        )
        .range([height, 0])

      svg.append('g').call(d3.axisLeft(y)).attr('font-size', '12px')


      // Create a tooltip
      const tooltip = d3.select(d3Container.current).append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'white')
        .style('border', '1px solid #d3d3d3')
        .style('padding', '10px')
        .style('border-radius', '5px')

      // Create a group for each domain
      const domainGroup = svg.selectAll('.domainName')
        .data(domainArray)
        .enter().append('g')
        .attr('class', 'domainName')
        .attr(
          'transform',
          (d: any) => `translate(${x0(d.domainName)},0)`
        )

      // Create bars for each facet in each domain
      domainGroup.selectAll('.bar')
        .data((d: any) => d.facetScores)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) => x1(d.facetName) as number)
        .attr('y', (d: any) => y(d.facetScore))
        // Adjust bandwidth here if needed
        .attr('width', x1.bandwidth() + 3)
        .attr(
          'height',
          (d: any) => height - y(d.facetScore)
        )
        .attr('fill', (d, i) => d3.schemeTableau10[i % 10])
        .on('mouseover', function (event, d) {
          tooltip.style('opacity', 1)
          d3.select(this).style('stroke', 'black').style('opacity', 0.8)
        })
        .on('mousemove', function (event, d: any) {
          tooltip
            .html(`Facet: ${d.facetName}<br/>Score: ${d.facetScore}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
        })
        .on('mouseleave', function (event, d) {
          tooltip.style('opacity', 0)
          d3.select(this).style('stroke', 'none').style('opacity', 1)
        })

      // Optionally, add labels or tooltips as needed
    }
  }, [data])




  return (
    <>
      <Title isExample={ isExample } title={ title } />
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}


export default BarChart
