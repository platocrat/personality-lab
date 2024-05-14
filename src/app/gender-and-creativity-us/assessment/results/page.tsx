// Externals
import { FC } from 'react'

// Locals
// Sections
import GenderAndCreativityUsResults from '@/sections/assessments/gender-and-creativity-us/results'
// CSS
import styles from '@/app/page.module.css'



type ResultsProps = {}




const Results: FC<ResultsProps> = ({

}) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <GenderAndCreativityUsResults />
      </main>
    </>
  )
}

export default GenderAndCreativityUsResults