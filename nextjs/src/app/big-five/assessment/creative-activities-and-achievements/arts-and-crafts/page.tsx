// Externals
import { FC } from 'react'

// Locals
// Sections
import ArtsAndCraftsForm from '@/sections/assessments/big-five/forms/arts-and-crafts'
// CSS
import styles from '@/app/page.module.css'



type ArtsAndCraftsProps = {}




const ArtsAndCrafts: FC<ArtsAndCraftsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <ArtsAndCraftsForm />
      </main>
    </>
  )
}

export default ArtsAndCrafts