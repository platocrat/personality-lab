'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiAssessmentResultsSection from '@/sections/assessments/bessi/assessment/results'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'





type BessiAssessmentResultProps = {}


const BessiAssessmentResults: FC<BessiAssessmentResultProps> = () => {
  // Contexts
  const { bessiSkillScores } = useContext(BessiSkillScoresContext)
  // Hooks
  const router = useRouter()
  // States
  const [ 
    isGettingBessiSkillScores, 
    setIsGettingBessiSkillScores 
  ] = useState(true)


  useLayoutEffect(() => {
    if (!bessiSkillScores) {
      router.push('/bessi')
    } else {
      setIsGettingBessiSkillScores(false)
    }
  }, [ bessiSkillScores ])




  return (
    <>
      { isGettingBessiSkillScores ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          <main className={ `${styles.main} ` }>
            <BessiAssessmentResultsSection />
          </main>
        </>
      ) }
    </>
  )
}

export default BessiAssessmentResults