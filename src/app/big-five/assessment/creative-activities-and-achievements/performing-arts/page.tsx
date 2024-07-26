// Externals
import { FC } from 'react'

// Locals
// Sections
import PerformingArtsForm from '@/sections/assessments/big-five/forms/performing-arts'
// CSS
import styles from '@/app/page.module.css'



type PerformingArtsProps = {}




const PerformingArts: FC<PerformingArtsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <PerformingArtsForm />
      </main>
    </>
  )
}

export default PerformingArts