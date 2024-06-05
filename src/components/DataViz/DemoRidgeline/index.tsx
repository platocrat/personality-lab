// Externals
import * as d3 from 'd3'
import { FC, useEffect, useMemo, useRef } from 'react'
// Locals
import { 
  kernelEpanechnikov,
  kernelDensityEstimator,
} from '@/utils'



const MARGIN = { top: 90, right: 30, bottom: 60, left: 120 }
const X_LIMITS = [-20, 120]
const X_SCALE_PADDING = 20
const DENSITY_BAND_HEIGHT = 100



type DemoRidgelinePlotProps = {
  width: number
  height: number
  data: { key: string; values: number[] }[]
}





const DemoRidgelinePlot: FC<DemoRidgelinePlotProps> = ({ 
  data,
  width, 
  height,
}) => {
  const axesRef = useRef(null)
  const boundsWidth = width - MARGIN.right - MARGIN.left
  const boundsHeight = height - MARGIN.top - MARGIN.bottom

  const allGroups = data.map((group) => group.key)


  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(X_LIMITS).range([10, boundsWidth]).nice()
  }, [data, width])



  // Render the X axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current)
    svgElement.selectAll('*').remove()
    const xAxisGenerator = d3.axisBottom(xScale)
    svgElement
      .append('g')
      .attr(
        'transform',
        'translate(0,' + (boundsHeight + X_SCALE_PADDING) + ')'
      )
      .call(xAxisGenerator)
  }, [xScale, boundsHeight])


  // Compute kernel density estimation for each groups
  const densities = useMemo(() => {
    const kde = kernelDensityEstimator(
      d3, 
      kernelEpanechnikov(7), 
      xScale.ticks(40)
    )

    return data.map((group) => {
      return {
        key: group.key,
        density: kde(group.values) as [number, number][],
      }
    })
  }, [xScale, data])

  const densityMax = Math.max(
    ...densities.map((group) => Math.max(...group.density.map((y) => y[1])))
  )

  // Create a Y scale for each density
  const yScale = d3
    .scaleLinear()
    .domain([0, densityMax])
    .range([DENSITY_BAND_HEIGHT, 0])

  // Create the Y axis for groups
  var groupScale = d3
    .scaleBand()
    .domain(allGroups)
    .range([0, boundsHeight])
    .paddingInner(1)

  const paths = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis)

    return densities.map((group, i) => {
      const path = lineGenerator(group.density)
      return (
        <path
          key={ i }
          d={ path as any }
          transform={
            'translate(0,' + (groupScale(group.key) as any - DENSITY_BAND_HEIGHT) + ')'
          }
          fill='#007ac0c5'
          opacity={ 0.5 }
          stroke='black'
          strokeWidth={ 2 }
          strokeLinejoin='round'
        />
      )
    })
  }, [densities])


  const labels = useMemo(() => {
    return densities.map((group, i) => {
      return (
        <text
          key={ i }
          x={ -5 }
          y={ groupScale(group.key) }
          textAnchor='end'
          dominantBaseline='middle'
          fontSize={ 10 }
        >
          { group.key }
        </text>
      )
    })

  }, [densities])





  return (
    <>
      <svg width={ width } height={ height }>
        <g
          width={ boundsWidth }
          height={ boundsHeight }
          transform={ `translate(${[MARGIN.left, MARGIN.top].join(',')})` }
        >
          { paths }
          { labels }
        </g>
        <g
          width={ boundsWidth }
          height={ boundsHeight }
          ref={ axesRef }
          transform={ `translate(${[MARGIN.left, MARGIN.top].join(',')})` }
        />
      </svg>
    </>
  )
}


export default DemoRidgelinePlot