// Externals
import * as d3 from 'd3'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// Locals
import LineCharts from './line-charts'
import ImportantWeeklyUpdates from './important-weekly-updates'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Utils
import {
  DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA
} from './dummy-data'
import { FACET_FEEDBACK } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/sections/profile/historical-assessments/HistoricalAssessments.module.css'




export type TopChangesType = {
  key: string
  change: number
  type: string
  firstScore: number
  lastScore: number
}

// ------------------------------- Utility Functions ---------------------------
const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').trim()
}


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



// ------------------------------ Function Component ---------------------------
const HistoricalAssessments = () => {
  const { facetScores, domainScores } = DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA

  const facetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const domainRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const facetChartData = generateChartData(facetScores)
  const domainChartData = generateChartData(domainScores)

  const [ loading, setLoading ] = useState(true) // State to manage loading


  // --------------------------- Functions -------------------------------------
  // ~~~~~~~~ Using `useCallback` ~~~~~~~~
  const facetDescriptions = useCallback((data): string => {
    const facet = FACET_FEEDBACK[data.key]
    let _ = ''

    if (facet) {
      const valuesLength = data.values.length - 1
      const mostRecentScore = data.values[valuesLength].score

      if (mostRecentScore >= 70) {
        _ = facet['top-third']
      } else if (mostRecentScore < 70 && mostRecentScore >= 40) {
        _ = facet['middle']
      } else if (mostRecentScore < 40) {
        _ = facet['bottom-third']
      } else {
        _ = ''
      }

      return _
    }

    return _
  }, [])


  // ~~~~~~~~ Regular Functions ~~~~~~~~
  const calculateTopChanges = () => {
    const allScores = [...facetChartData, ...domainChartData]
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const changes = allScores.map(data => {
      const recentScores = data.values.filter((d: any) => d.timestamp >= oneWeekAgo)
      if (recentScores.length < 2) return null

      const firstScore = recentScores[0].score
      const lastScore = recentScores[recentScores.length - 1].score
      const change = lastScore - firstScore
      const percentageChange = (change / firstScore) * 100

      return {
        key: data.key,
        change: percentageChange,
        type: facetScores[data.key] ? 'Facet' : 'Domain',
        firstScore,
        lastScore
      }
    }).filter(change => change !== null)

    changes.sort((a: any, b: any) => Math.abs(b.change) - Math.abs(a.change))
    return changes.slice(0, 5)
  }


  // ~~~~~~~~ Memoized Functions ~~~~~~~~
  const topChanges: TopChangesType[] = useMemo(
    calculateTopChanges,
    [facetChartData, domainChartData]
  ) as TopChangesType[]


  // ~~~~~~~~ d3.js Functions ~~~~~~~~
  const createChart = (
    data: {
      key: string,
      values: {
        score: number,
        timestamp: Date
      }[]
    },
    chartRef: HTMLDivElement | null,
    title: string
  ) => {
    if (!chartRef) return

    // Clear any existing SVG content before creating a new chart
    d3.select(chartRef).selectAll('*').remove()

    const margin = { top: 0, right: 30, bottom: 50, left: 40 }
    const width = 500 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3.select(chartRef)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '-30 -20 500 450') // Adjusted to shift horizontally
      .classed(dataVizStyles.svgContent, true)

    const x = d3.scaleTime()
      .domain(d3.extent(data.values, d => d.timestamp) as [Date, Date])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0])

    const color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain([data.key])

    // Add the X gridlines
    svg.append('g')
      .attr('class', styles.grid)
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeDay.every(1))
        .tickSize(-height)
        .tickFormat('' as any))

    // Add the Y gridlines
    svg.append('g')
      .attr('class', styles.grid)
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('' as any))

    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeDay.every(1)) // Adjust this to set the frequency of tick marks
        .tickFormat(d3.timeFormat('%b %d') as any) // Adjust this to set the format of tick labels
        .tickSize(10)
        .tickSizeOuter(10))

    svg.append('g')
      .call(d3.axisLeft(y))

    // Rotate the x-axis tick labels
    xAxis.selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')

    const line = d3.line<{ score: number, timestamp: Date }>()
      .x(d => x(d.timestamp))
      .y(d => y(d.score))

    svg.append('path')
      .datum(data.values)
      .attr('fill', 'none')
      .attr('stroke', color(data.key) as string)
      .attr('stroke-width', 2.0)
      .attr('d', line)

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#f8f8f8')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 0 5px rgba(0, 0, 0, 0.3)')
      .style('font-size', '12px')

    svg.selectAll('.dot')
      .data(data.values)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.score))
      .attr('r', 4)
      .attr('fill', color(data.key) as string)
      .on('mouseover', (event, d) => {
        tooltip.html(`Score: ${d.score}<br>Date: ${d3.timeFormat('%b %d, %Y')(d.timestamp)}`)
          .style('visibility', 'visible')
      })
      .on('mousemove', (event) => {
        tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`)
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden')
      })

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text(title)
  }

  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    facetChartData.forEach(data => {
      createChart(
        data as any,
        facetRefs.current[data.key],
        `Facet Score: ${data.key}`
      )
    })
    setLoading(false) // Set loading to false when charts are done
  }, [facetChartData])

  useEffect(() => {
    domainChartData.forEach(data => {
      createChart(
        data as any,
        domainRefs.current[data.key],
        `Domain Score: ${ data.key }`
      )
    })
    setLoading(false) // Set loading to false when charts are done
  }, [domainChartData])




  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <ImportantWeeklyUpdates
          formatKey={ formatKey }
          topChanges={ topChanges }
        />

        { loading ? (
          <>
            <div 
              style={{ 
                ...definitelyCenteredStyle, 
                position: 'relative', 
                top: '20px' 
              }}
            >
              <Spinner height={ '40' } width={ '40'} />
            </div>
          </>
        ) : (
          <>
            <LineCharts
              formatKey={ formatKey }
              facetRefs={ facetRefs }
              domainRefs={ domainRefs }
              facetChartData={ facetChartData }
              domainChartData={ domainChartData }
            />
          </>
        )}
      </div>
    </>
  )
}


export default HistoricalAssessments