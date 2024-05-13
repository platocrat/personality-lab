// Externals
import { FC } from 'react'

// Locals
// Sections
import LevelOfAgreementForm from '@/sections/assessments/gender-and-creativity-us/forms/level-of-agreement'
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