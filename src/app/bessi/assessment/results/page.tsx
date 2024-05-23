// Externals
import { FC } from 'react'

// Locals
// Sections
import BessiAssessmentResultsSection from '@/sections/assessments/bessi/assessment/results'
// CSS
import styles from '@/app/page.module.css'





type BessiAssessmentResultProps = {}


const BessiAssessmentResults: FC<BessiAssessmentResultProps> = () => {

  return (
    <>
      <main className={ `${styles.main} ` }>
        <BessiAssessmentResultsSection />
      </main>
    </>
  )
}

export default BessiAssessmentResults