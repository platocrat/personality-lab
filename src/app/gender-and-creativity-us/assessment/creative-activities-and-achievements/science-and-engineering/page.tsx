// Externals
import { FC } from 'react'

// Locals
// Sections
import ScienceAndEngineeringForm from '@/sections/assessments/gender-and-creativity-us/forms/science-and-engineering'
// CSS
import styles from '@/app/page.module.css'



type ScienceAndEngineeringProps = {}




const ScienceAndEngineering: FC<ScienceAndEngineeringProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <ScienceAndEngineeringForm />
      </main>
    </>
  )
}

export default ScienceAndEngineering