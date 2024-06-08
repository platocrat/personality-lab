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
    isParticipant,
    isFetchingAccount,
  } = useAccount()
  const router = useRouter()
  // States
  const [ isGettingCurrentStudy, setIsGettingCurrentStudy ] = useState(true)


  useLayoutEffect(() => {
    if (!isFetchingAccount) {
      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/app/bessi/assessment/page.tsx" --function="useLayoutEffect()"]: isAdmin: `,
        isAdmin
      )

      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/app/bessi/assessment/page.tsx" --function="useLayoutEffect()"]: isParticipant: `,
        isParticipant
      )

      console.log(
        `[${new Date().toLocaleString()}: --filepath="src/app/bessi/assessment/page.tsx" --function="useLayoutEffect()"]: isFetchingAccount: `,
        isFetchingAccount
      )

      const key = 'currentStudy'
      const currentStudy = localStorage.getItem(key)

      if (isParticipant) {
        if (!currentStudy) {
          router.push('/bessi')
        } else {
          setIsGettingCurrentStudy(false)
        }
      } else {
        if (isAdmin) {
          setIsGettingCurrentStudy(false)
        } else {
          router.push('/bessi')
        }
      } 
    }
  }, [ isAdmin, isParticipant, isFetchingAccount ])




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