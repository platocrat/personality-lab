// Externals
import {
  FC
} from 'react'
// Locals
// Sections
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
// CSS
import styles from '@/app/page.module.css'


type BessiAssessmentProps = {}



const BessiAssessment: FC<BessiAssessmentProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <BessiAssessmentSection />
      </main>
    </>
  )
}

export default BessiAssessment