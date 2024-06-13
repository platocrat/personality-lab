import * as d3 from 'd3'
import React, { useEffect, useRef } from 'react'
// Locals
import { 
  DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA 
} from './dummy-data'
// CSS
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/sections/profile/historical-assessments/HistoricalAssessments.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


const HistoricalAssessments = () => {
  const { facetScores, domainScores } = DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA

  const facetChartRef = useRef<any>(null)
  const domainChartRef = useRef<any>(null)

  // Function to convert the scores data to d3 format
  const generateChartData = (
    scores: { 
      [key: string]: { 
        score: number, 
        timestamp: number 
      }[] 
    }
  ) => {
    const data: { 
      key: string, 
      values: { 
        score: number, 
        timestamp: number 
      }[] 
    }[] = []

    for (const key in scores) {
      data.push({
        key,
        values: scores[key].map(
          score => ({
            score: score.score,
            timestamp: new Date(score.timestamp),
          }
        )) as any,
      })
    }

    return data
  }

  const facetChartData = generateChartData(facetScores)
  const domainChartData = generateChartData(domainScores)


  const createChart = (
    data: { 
      key: string, 
      values: { 
        score: number, 
        timestamp: Date 
      }[] 
    }[], 
    chartRef: any, 
    title: string
  ) => {
    const d3Container = d3.select(chartRef.current)
    d3Container.selectAll('*').remove() // Clear previous content

    const svg = d3Container.append('svg')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 -100 350 175')
      .classed(dataVizStyles.svgContent, true)

    const margin = { top: 20, right: 60, bottom: 30, left: 40 }
    const width = 350
    const height = 175

    console.log(
      `[ ${ new Date().toLocaleString() } --filepath="src/sections/profile/historical-assessments/index.tsx" --function="createChart()" ]: width: `, 
      width
    )
    console.log(
      `[ ${ new Date().toLocaleString() } --filepath="src/sections/profile/historical-assessments/index.tsx" --function="createChart()" ]: height: `, 
      height
    )

    const x = d3.scaleTime()
      .domain([
        d3.min(data, d => d3.min(d.values, v => v.timestamp))!,
        d3.max(data, d => d3.max(d.values, v => v.timestamp))!
      ])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, 100]) // Fixed range from 0 to 100
      .range([height, 0])

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const line = d3.line<{ score: number, timestamp: Date }>()
      .x(d => x(d.timestamp))
      .y(d => y(d.score))

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))

    g.append('g')
      .call(d3.axisLeft(y))

    const chartTitle = svg.append('text')
      .attr('x', width / 2 + margin.left)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text(title)

    const lines = g.selectAll('.line')
      .data(data)
      .enter().append('g')
      .attr('class', 'line')

    lines.append('path')
      .attr('fill', 'none')
      .attr('stroke', d => color(d.key)!)
      .attr('stroke-width', 1.5)
      .attr('d', d => line(d.values)!)

    lines.append('text')
      .datum(d => ({ key: d.key, value: d.values[d.values.length - 1] }))
      .attr('transform', d => `translate(${x(d.value.timestamp)},${y(d.value.score)})`)
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => d.key)
  }

  useEffect(() => {
    createChart(
      domainChartData as any,
      domainChartRef, 
      'Domain Scores Over Time'
    )
  }, [domainChartData])

  useEffect(() => {
    createChart(
      facetChartData as any, 
      facetChartRef, 
      'Facet Scores Over Time'
    )
  }, [facetChartData])


  return (
    <>
      <div 
        style={{
          ...definitelyCenteredStyle,
          flexDirection: 'column',
          width: '1400px',
          height: '600px',
        }}
      >
        <div 
          ref={ domainChartRef } 
          className={ styles.svgContainer }
        />
        <div 
          ref={ facetChartRef } 
          className={ dataVizStyles.svgContainer }
        />
      </div>
    </>
  )
}


export default HistoricalAssessments