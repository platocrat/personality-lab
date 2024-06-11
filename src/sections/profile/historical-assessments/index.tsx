// Externals
import { FC, useEffect, useState } from 'react'


// Define the type for an assessment result
type AssessmentResult = {
  date: string
  score: number
  // Add more fields as needed
}

type HistoricalAssessmentProps = {
  
}




const HistoricalAssessments: FC<HistoricalAssessmentProps> = () => {
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    // Mock fetching assessment results, replace with actual API call
    const fetchResults = async () => {
      try {
        setIsLoading(true)
        // Replace this with your API call to fetch results
        const mockResults: AssessmentResult[] = [
          { date: '2024-01-01', score: 85 },
          { date: '2024-02-01', score: 90 },
          { date: '2024-03-01', score: 88 }
        ]
        setResults(mockResults)
      } catch (error) {
        console.error('Error fetching assessment results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])




  return (
    <div>
      <h2>Historical Assessment Results</h2>
      { isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          { results.map((result, index) => (
            <li key={ index }>
              { result.date }: { result.score }
            </li>
          )) }
        </ul>
      ) }
    </div>
  )
}


export default HistoricalAssessments