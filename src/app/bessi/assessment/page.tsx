'use client'

// Externals
import {
  FC,
  useState,
  useLayoutEffect,
  } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
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
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { 
    isAdmin,
    getAccount,
    isParticipant,
    isFetchingAccount,
  } = useAccount()
  const router = useRouter()
  // States
  const [ isGettingCurrentStudy, setIsGettingCurrentStudy ] = useState(true)


  useLayoutEffect(() => {
    if (!isLoading && user && user.email) {
      getAccount()

      const key = 'currentStudy'
      const currentStudy = localStorage.getItem(key)

      if (isParticipant) {
        if (!currentStudy) {
          router.push('/bessi')
        } else {
          setIsGettingCurrentStudy(false)
        }
      } else if (isAdmin) {
        setIsGettingCurrentStudy(false)
      } else {
        router.push('/bessi')
      } 
    }
  }, [ isLoading, router ])




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