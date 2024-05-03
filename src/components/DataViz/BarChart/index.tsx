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
    facetScores: FacetFactorType,
    domainScores: SkillDomainFactorType,
  }
}



const BarChart: FC<BarChartType> = ({ isExample, data }) => {
  const d3Container = useRef(null)    
  const title = 'BESSI Bar Chart'


  
  useEffect(() => {
    if (data && d3Container.current) {
      // Create a mapping from domain names to domain data
      const domainMap = Object.entries(data.domainScores).reduce((acc, [key, value]) => {
        acc[key] = {
          domainName: key + ` (${value})`, // Append the domain score to the domain name
          domainScore: value,
          facetScores: [] // Array to hold facet scores for this domain
        }
        return acc
      }, {})

      // console.log(`domainMap: `, domainMap)


      // Assign facet scores to the correct domain
      Object.entries(data.facetScores).forEach(([key, value]) => {
        const domainInfo = getSkillDomainAndWeight(key as Facet)

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

      // console.log(`domainArray: `, domainArray)


      const margin = { top: 30, right: 40, bottom: 60, left: 100 }
      const width = 700 - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom

      d3.select(d3Container.current).selectAll('*').remove()

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 85)
        .append('g')
        .attr('transform', `translate(${margin.left - 20}, ${margin.top})`)

      // Setup the x-axis
      const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.01) // Less padding means more space for bars
        .domain(domainArray.map((d: any) => d.domainName))

      const x1 = d3.scaleBand()
        .padding(0.1) // Ensure facets are visible by adjusting padding
        .domain(domainArray.flatMap(
          (d: any) => d.facetScores.map((f: any) => f.facetName)
        ))
        .rangeRound([0, x0.bandwidth()])

      // console.log(`x0.domain(): `, x0.domain())
      console.log(`x1.domain(): `, x1.domain())


      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .attr('font-size', '13px')

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

      // Mouse event handlers
      const mouseover = function (event, d) {
        tooltip.style('opacity', 1)
        d3.select(this).style('stroke', 'black').style('opacity', 0.8)
      }

      const mousemove = function (event, d) {
        tooltip
          .html(`Facet: ${d.facetName}<br/>Score: ${d.facetScore}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      }

      const mouseleave = function (event, d) {
        tooltip.style('opacity', 0)
        d3.select(this).style('stroke', 'none').style('opacity', 1)
      }


      // Create a group for each domain
      const domainGroup = svg.selectAll('.domain')
        .data(domainArray)
        .enter().append('g')
        .attr('class', 'domain')
        .attr(
          'transform', 
          (d: any) => `translate(${ x0(d.domainName) },0)`
        )

      // Create bars for each facet in each domain
      domainGroup.selectAll('.bar')
        .data((d: any) => d.facetScores)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) => x1(d.facetName) as number)
        .attr('y', (d: any) => y(d.facetScore))
        .attr('width', x1.bandwidth()) // Adjust bandwidth here if needed
        .attr(
          'height', 
          (d: any) => height - y(d.facetScore)
        )
        .attr('fill', (d, i) => d3.schemeTableau10[i % 10])
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

      // Optionally, add labels or tooltips as needed
    }
  }, [data])



  // // create a tooltip
  // const tooltip = d3.select('body')
  //   .append('div')
  //   .attr('class', 'tooltip')

  // // tooltip events
  // const mouseover = function (d) {
  //   tooltip
  //     .style('opacity', 1)
  //   d3.select(this)
  //     .style('stroke', '#EF4A60')
  //     .style('opacity', .5)
  // }
  // const mousemove = function (event, d) {
  //   const subgroupName = d3.select(this.parentNode).datum().key
  //   const subgroupValue = d.data[subgroupName]
  //   const f = d3.format('.0f')
  //   tooltip
  //     .html(`<b>${subgroupName}</b>:  ${f(subgroupValue * 100)}%`)
  //     .style('top', event.pageY - 10 + 'px')
  //     .style('left', event.pageX + 10 + 'px')
  // }
  // const mouseleave = function (d) {
  //   tooltip
  //     .style('opacity', 0)
  //   d3.select(this)
  //     .style('stroke', 'none')
  //     .style('opacity', 1)
  // }

  // // create bars
  // svg.append('g')
  //   .selectAll('g')
  //   .data(stackedData)
  //   .join('g')
  //   .attr('fill', d => color(d.key))
  //   .selectAll('rect')
  //   .data(d => d)
  //   .join('rect')
  //   .attr('x', d => xScale(d.data.Year))
  //   .attr('y', d => yScale(d[1]))
  //   .attr('width', xScale.bandwidth())
  //   .attr('height', d => yScale(d[0]) - yScale(d[1]))
  //   .on('mouseover', mouseover)
  //   .on('mousemove', mousemove)
  //   .on('mouseleave', mouseleave)


  return (
    <>
      <Title isExample={ isExample } title={ title } />
      <div ref={ d3Container } style={ definitelyCenteredStyle } />
    </>
  )
}


export default BarChart
