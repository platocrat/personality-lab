// Externals
import { FC } from 'react'

// Locals
// Sections
import LevelOfAgreementForm from '@/sections/assessments/big-five/forms/level-of-agreement'
// CSS
import styles from '@/app/page.module.css'



type LevelOfAgreementProps = {}




const LevelOfAgreement: FC<LevelOfAgreementProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <LevelOfAgreementForm />
      </main>
    </>
  )
}

export default LevelOfAgreement