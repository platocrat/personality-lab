// Externals
import { FC } from 'react'

// Locals
// Sections
import LiteratureForm from '@/sections/assessments/big-five/forms/literature'
// CSS
import styles from '@/app/page.module.css'



type LiteratureProps = {}




const Literature: FC<LiteratureProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <LiteratureForm />
      </main>
    </>
  )
}

export default Literature