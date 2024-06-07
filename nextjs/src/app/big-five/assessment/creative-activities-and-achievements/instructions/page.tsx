// Externals
import { FC } from 'react'

// Locals
// Sections
import CreativeActivitesAndAchievementsDescription from '@/sections/assessments/big-five/descriptions/creative-activities-and-achievements'
// CSS
import styles from '@/app/page.module.css'



type InstructionsProps = {}




const Instructions: FC<InstructionsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <CreativeActivitesAndAchievementsDescription />
      </main>
    </>
  )
}

export default Instructions