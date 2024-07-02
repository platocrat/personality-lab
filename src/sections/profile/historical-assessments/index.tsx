// Externals
import * as d3 from 'd3'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
// Locals
import {
  DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA
} from './dummy-data'
import { FACET_FEEDBACK } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import dataVizStyles from '@/components/DataViz/DataViz.module.css'
import styles from '@/sections/profile/historical-assessments/HistoricalAssessments.module.css'

const HistoricalAssessments = () => {
  const { facetScores, domainScores } = DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA

  const facetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const domainRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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

  const topChanges = useMemo(calculateTopChanges, [facetChartData, domainChartData])

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

  useEffect(() => {
    facetChartData.forEach(data => {
      createChart(
        data as any,
        facetRefs.current[data.key],
        `Facet Score: ${data.key}`
      )
    })
  }, [facetChartData])

  useEffect(() => {
    domainChartData.forEach(data => {
      createChart(
        data as any,
        domainRefs.current[data.key],
        `Domain Score: ${data.key}`
      )
    })
  }, [domainChartData])

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <>
      <div style={ { width: '100%' } }>
        {/* Important weekly updates */ }
        <div className={ styles.cardsContainer }>
          { topChanges.map((change: any) => (
            <div key={ change.key } className={ styles.card }>
              {/* Title */ }
              <div style={ { display: 'flex', flexDirection: 'column' } }>
                <h3>
                  { `${change.type}:` }
                </h3>
                <div
                  style={{
                    margin: '3px'
                  }}
                >
                  <h3>
                    { `${formatKey(change.key)}` }
                  </h3>
                </div>
              </div>
              {/* Change over week */ }
              <div>
                {/* Magnitude change */ }
                <p style={ { marginBottom: '4px' } }>
                  { `From: ${change.firstScore} to ${change.lastScore}` }
                </p>
                {/* Percent Change */ }
                <p style={ { color: change.change > 0 ? 'green' : 'red' } }>
                  { `${change.change > 0 ? '+' : ''} ${change.change.toFixed(2)}%` }
                </p>
              </div>

              <div className={ styles.progressBarContainer }>
                <div
                  className={ styles.progressBar }
                  style={ {
                    width: `${Math.min(100, Math.abs(change.change))}%`,
                    backgroundColor: change.change > 0 ? 'green' : 'red'
                  } }
                />
              </div>
            </div>
          )) }
        </div>
        {/* Historical Line Charts */ }
        <div>
          {/*  */ }
          <div style={ { marginBottom: '20px' } }>
            <div style={ definitelyCenteredStyle }>
              <h2 style={ { fontSize: 'clamp(13px, 2vw, 16px)', margin: '12px 0px' } }>
                { `Domain Scores` }
              </h2>
            </div>
            <div style={ { display: 'flex', flexWrap: 'wrap' } }>
              { domainChartData.map(data => (
                <div
                  key={ data.key }
                  style={ { display: 'flex', width: '100%', marginBottom: '20px' } }
                >
                  <div style={ { flex: 1, textAlign: 'center' } }>
                    <p style={ { fontSize: 'clamp(9px, 2vw, 13px)' } }>
                      { `Domain: ${formatKey(data.key)}` }
                    </p>
                  </div>
                  <div style={ { flex: 1 } }>
                    <div
                      className={ dataVizStyles.svgContainer }
                      ref={ (el: any) => domainRefs.current[data.key] = el }
                    />
                  </div>
                </div>
              )) }
            </div>
          </div>
          {/*  */ }
          <div>
            <div style={ definitelyCenteredStyle }>
              <h2 style={ { fontSize: 'clamp(13px, 2vw, 16px)', margin: '12px 0px' } }>
                { `Facet Scores` }
              </h2>
            </div>
            <div style={ { display: 'flex', flexWrap: 'wrap' } }>
              { facetChartData.map(data => (
                <div
                  key={ data.key }
                  style={ { display: 'flex', width: '100%', marginBottom: '20px' } }
                >
                  <div style={ { flex: 1, textAlign: 'center' } }>
                    <p style={ { fontSize: 'clamp(9px, 2vw, 13px)' } }>
                      { `Facet: ${formatKey(data.key)}` }
                    </p>
                    <div
                      style={ {
                        marginTop: '24px',
                        padding: '4px 8px',
                      } }
                    >
                      <p
                        style={ {
                          textAlign: 'left',
                          fontSize: 'clamp(9px, 2vw, 13px)'
                        } }
                      >
                        { facetDescriptions(data) }
                      </p>
                    </div>
                  </div>
                  <div style={ { flex: 1 } }>
                    <div
                      className={ dataVizStyles.svgContainer }
                      ref={ (el: any) => facetRefs.current[data.key] = el }
                    />
                  </div>
                </div>
              )) }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HistoricalAssessments
