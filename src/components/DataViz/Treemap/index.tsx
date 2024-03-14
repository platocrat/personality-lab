// Externals
import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
// Locals
import { definitelyCenteredStyle } from '@/theme/styles'
import { facetToDomainMapping } from '@/utils/bessi/constants'



const Treemap = ({ data }) => {
  const d3Container = useRef(null)



  const transformData = (originalData) => {
    const children = Object.entries(
      facetToDomainMapping
    ).map(([facet, domains]) => {
      const domainChildren = domains.map((domain: string) => {
        const domainScore = originalData.domainScores[domain] || 0
        return { name: domain, value: domainScore }
      }
      ).filter(domain => domain.value > 0) // Filter out domains with no score
      const facetScore = originalData.facetScores[facet] || 0
      return { name: facet, children: domainChildren, value: facetScore }
    })

    return { name: 'root', children }
  }

  const drawTreemap = (originalData) => {
    const width = 800
    const height = 600

    // Clear the container first
    d3.select(d3Container.current).select('*').remove()

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const root: any = d3.hierarchy(transformData(originalData))
      .sum((d: any) => d.value)
      .sort(
        (a: any, b: any) => b.height - a.height || b.value - a.value
      )

    d3.treemap()
      .size([width, height])
      .paddingTop(24)
      .paddingRight(4)
      .paddingInner(4)(root)

    const color: any = d3.scaleOrdinal()
      .domain(transformData(originalData).children.map(d => d.name))
      // This will use 10 predefined colors adjust as needed
      .range(d3.schemeCategory10)

    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)

    leaf.append('rect')
      .attr('id', (d: any) => (d.leafUid = d))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr(
        'fill',
        (d: any) => {
          while (d.depth > 1) d = d.parent
          return color(d.data.name)
        }
      )

    leaf.append('clipPath')
      .attr('id', (d: any) => (d.clipUid = d))
      .append('use')
      .attr('xlink:href', (d: any) => d.leafUid.href)

    leaf.append('text')
      .attr('clip-path', (d: any) => d.clipUid)
      .selectAll('tspan')
      // Split camelCase names
      .data((d: any) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter().append('tspan')
      .attr('x', 4)
      .attr('y', (d, i) => 13 + i * 10)
      .text((d: any) => d)

    // Optionally, add a title for tooltip
    leaf.append('title')
      .text((d: any) => `${d.data.name}\n${d.value}`)

    // Adding parent node labels
    const parents = svg.selectAll('g.parent')
      .data(root.descendants().filter(d => d.depth === 1))
      .enter().append('g')
      .attr('class', 'parent')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)

    parents.append('text')
      .attr('dy', '1.0em')
      .text((d: any) => d.data.name)
      .attr('font-size', '16px')
      .attr('fill', 'black')
  }


  useEffect(() => {
    if (data && d3Container.current) {
      drawTreemap(data)
    }
  }, [data])


  return (
    <div ref={ d3Container } style={definitelyCenteredStyle} />
  )
}

export default Treemap
