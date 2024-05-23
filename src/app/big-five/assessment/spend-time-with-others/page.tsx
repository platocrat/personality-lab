// Externals
import { FC } from 'react'

// Locals
// Sections
import SpendTimeWithOthersForm from '@/sections/assessments/big-five/forms/spend-time-with-others'
// CSS
import styles from '@/app/page.module.css'



type SpendTimeWithOthersProps = {}




const SpendTimeWithOthers: FC<SpendTimeWithOthersProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <SpendTimeWithOthersForm />
      </main>
    </>
  )
}

export default SpendTimeWithOthers