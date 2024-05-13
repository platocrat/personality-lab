// Externals
import { FC } from 'react'

// Locals
// Sections
import DemographicsForm from '@/sections/assessments/gender-and-creativity-us/forms/demographics'
// CSS
import styles from '@/app/page.module.css'



type GenderAndCreativityUsAssessmentProps = {}




const GenderAndCreativityUsAssessment: FC<GenderAndCreativityUsAssessmentProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <DemographicsForm />
      </main>
    </>
  )
}

export default GenderAndCreativityUsAssessment