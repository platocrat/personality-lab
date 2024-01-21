'use client';

// Externals
import { FC } from 'react'
import { Inter } from 'next/font/google'
// Locals
// Sections
import BessiAssessment from '@/sections/assessments/bessi/assessment'
// CSS
import styles from '@/app/page.module.css'


const inter = Inter({ subsets: ['latin'] })


type BessiProps = {}


const Bessi: FC<BessiProps> = ({ }) => {
  const title = `BESSI`
  const subtitle = `Complete the following questionnaire to learn more about your social, emotional, and behavioral skills. These are the skills that you use to start and support your relationships, keep your emotions in check, achieve your goals, and learn from experience. They’re things like goal setting, leadership, teamwork, creativity, and emotion regulation.`


  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        <BessiAssessment />
      </main>
    </>
  )
}

export default Bessi