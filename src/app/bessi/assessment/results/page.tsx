// Externals
import { FC } from 'react'
import { Inter } from 'next/font/google'
// Locals
// Sections
import BessiAssessmentResultsSection from '@/sections/assessments/bessi/assessment/results'
// CSS
import styles from '@/app/page.module.css'


const inter = Inter({ subsets: ['latin'] })


type BessiAssessmentResultProps = {}


const BessiAssessmentResults: FC<BessiAssessmentResultProps> = () => {

  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        <BessiAssessmentResultsSection />
      </main>
    </>
  )
}

export default BessiAssessmentResults