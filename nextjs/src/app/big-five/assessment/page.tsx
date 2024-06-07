// Externals
import { FC } from 'react'

// Locals
// Sections
import DemographicsForm from '@/sections/assessments/big-five/forms/demographics'
// CSS
import styles from '@/app/page.module.css'



type BigFiveAssessmentProps = {}




const BigFiveAssessment: FC<BigFiveAssessmentProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <DemographicsForm />
      </main>
    </>
  )
}

export default BigFiveAssessment