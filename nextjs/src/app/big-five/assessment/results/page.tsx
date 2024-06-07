// Externals
import { FC } from 'react'

// Locals
// Sections
import BigFiveResults from '@/sections/assessments/big-five/results'
// CSS
import styles from '@/app/page.module.css'



type ResultsProps = {}




const Results: FC<ResultsProps> = ({

}) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <BigFiveResults />
      </main>
    </>
  )
}

export default BigFiveResults