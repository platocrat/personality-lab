'use client'

// Externals
import {
  FC,
  useState,
  useLayoutEffect,
} from 'react'
import { useRouter } from 'next/navigation'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type BessiAssessmentProps = {}



const BessiAssessment: FC<BessiAssessmentProps> = ({ }) => {
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
            <BessiAssessmentSection />
          </main>
        </>
      )}
    </>
  )
}

export default BessiAssessment