'use client'

// Externals
import { useRouter } from 'next/navigation'
// import { useUser } from '@auth0/nextjs-auth0/client'
import {
  FC,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Sections
import BessiAssessmentSection from '@/sections/assessments/bessi/assessment'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Type
import { SessionContextType } from '@/contexts/types'
// // Hooks
// import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'


type BessiAssessmentProps = {}



const BessiAssessment: FC<BessiAssessmentProps> = ({ }) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()
  
  // Contexts
  const {
    isGlobalAdmin,
    isParticipant,
  } = useContext<SessionContextType>(SessionContext)

  // // Hooks
  // const { 
  //   isGlobalAdmin,
  //   isParticipant,
  //   isFetchingAccount,
  // } = useAccount()

  const router = useRouter()
  // States
  const [ isGettingCurrentStudy, setIsGettingCurrentStudy ] = useState(true)


  useLayoutEffect(() => {
    // if (!isFetchingAccount) {
      const key = 'currentStudy'
      const currentStudy = localStorage.getItem(key)

      if (isParticipant) {
        if (!currentStudy) {
          router.push('/bessi')
        } else {
          setIsGettingCurrentStudy(false)
        }
      } else {
        if (isGlobalAdmin) {
          setIsGettingCurrentStudy(false)
        } else {
          router.push('/bessi')
        }
      } 
    // }
  }, [ isGlobalAdmin, isParticipant, /* isFetchingAccount */ ])


  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isGettingCurrentStudy }
        spinnerOptions={{ showSpinner: true }}
      >
        <main className={ `${styles.main} ` }>
          <BessiAssessmentSection />
        </main>
      </NetworkRequestSuspense>
    </>
  )
}

export default BessiAssessment