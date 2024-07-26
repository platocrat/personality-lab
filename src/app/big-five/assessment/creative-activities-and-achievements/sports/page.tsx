// Externals
import { FC } from 'react'

// Locals
// Sections
import SportsForm from '@/sections/assessments/big-five/forms/sports'
// CSS
import styles from '@/app/page.module.css'



type SportsProps = {}




const Sports: FC<SportsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <SportsForm />
      </main>
    </>
  )
}

export default Sports