// Externals
import { FC } from 'react'

// Locals
// Sections
import SubmitResultsForm from '@/sections/assessments/big-five/forms/submit-results'
// CSS
import styles from '@/app/page.module.css'



type SubmitResultsProps = {}


const PAGE_FRAGMENT_ID = `submit-results`



const SubmitResults: FC<SubmitResultsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <SubmitResultsForm pageFragmentId={ PAGE_FRAGMENT_ID } />
      </main>
    </>
  )
}

export default SubmitResults