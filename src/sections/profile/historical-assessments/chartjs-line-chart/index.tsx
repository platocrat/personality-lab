import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart,
  Title,
  Legend,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  CategoryScale,
} from 'chart.js'
// Locals
import {
  DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA
} from '../dummy-data'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/profile/historical-assessments/chartjs-line-chart/ChartjsHistoricalAssessment.module.css'

Chart.register(
  Title,
  Legend,
  Tooltip,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
)

const ChartjsHistoricalAssessments = () => {
  const {
    facetScores,
    domainScores,
    demographics,
  } = DUMMY_USER_PROFILE_ASSESSMENT_HISTORICAL_DATA

  // Function to convert the scores data to chart.js data format
  const generateChartData = (
    scores: {
      [key: string]: {
        score: number,
        timestamp: number
      }[]
    }
  ) => {
    return Object.keys(scores).map(key => {
      const data = scores[key].map(score => ({
        x: new Date(score.timestamp).toLocaleDateString(),
        y: score.score
      }))
      return {
        key,
        data: {
          labels: data.map(d => d.x),
          datasets: [{
            label: key,
            data,
            fill: false,
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            tension: 0.1
          }]
        }
      }
    })
  }

  const facetChartData = generateChartData(facetScores)
  const domainChartData = generateChartData(domainScores)

  const createChartOptions = (
    title: string,
  ) => ({
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
          weight: 'bold'
        }
      },
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    },
  })

  return (
    <div>
      <div>
        <h2
          style={{
            ...definitelyCenteredStyle,
          }}
        >
          { `Domain Scores` }
        </h2>
        { domainChartData.map(data => (
          <div 
            key={ data.key } 
            className={ styles['chart-container'] }
          >
            <div className={ styles['chart'] }>
              <Line
                data={ data.data }
                options={ createChartOptions(`Domain Score: ${data.key}`) }
              />
            </div>
          </div>
        )) }
      </div>
      <div>
        <h2>
          { `Facet Scores` }
        </h2>
        { facetChartData.map(data => (
          <div key={ data.key } className={ styles['chart-container'] }>
            <div className={ styles['chart'] }>
              <Line
                data={ data.data }
                options={ createChartOptions(`Facet Score: ${data.key}`) }
              />
            </div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default ChartjsHistoricalAssessments
