'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiAssessmentResultsSection from '@/sections/assessments/bessi/assessment/results'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'





type BessiAssessmentResultProps = {}


const BessiAssessmentResults: FC<BessiAssessmentResultProps> = () => {
  // Hooks
  const router = useRouter()
  // States
  const [ isGettingCurrentStudy, setIsGettingCurrentStudy ] = useState(true)


  useLayoutEffect(() => {
    const key = 'currentStudy'
    const currentStudy = localStorage.getItem(key)

    if (!currentStudy) {
      router.push('/bessi')
    } else {
      setIsGettingCurrentStudy(false)
    }
  }, [])



  return (
    <>
      { isGettingCurrentStudy ? (
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