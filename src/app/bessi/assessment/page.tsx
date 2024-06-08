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
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type BessiAssessmentProps = {}



const BessiAssessment: FC<BessiAssessmentProps> = ({ }) => {
  // Hooks
  const { 
    isAdmin,
    getAccount,
    isParticipant,
    isFetchingAccount,
  } = useAccount()
  // Hooks
  const router = useRouter()
  // States
  const [ isGettingCurrentStudy, setIsGettingCurrentStudy ] = useState(true)


  useLayoutEffect(() => {
    const key = 'currentStudy'
    const currentStudy = localStorage.getItem(key)

    const requests = [
      getAccount(),
    ]

    Promise.all(requests)
    
    if (isAdmin) {
      setIsGettingCurrentStudy(false)
    } else {
      if (isParticipant) {
        if ( !currentStudy) {
          router.push('/bessi')
        } else {
          setIsGettingCurrentStudy(false)
        }
      } else {
        router.push('/bessi')
      }
    }
  }, [ isAdmin, isParticipant, router, isFetchingAccount ])



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