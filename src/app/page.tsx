'use client'

// Externals
import { useContext, useMemo } from 'react'
// Locals
// Sections
import AdminPortal from '@/sections/admin-portal'
import PersonalityAssessments from '@/sections/assessments'
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import styles from '@/app/page.module.css'





export default function Home() {
  const { isAdmin, isAuthenticated } = useContext(AuthenticatedUserContext)


  return (
    <>
      <main className={ `${styles.main} ` }>
        { isAuthenticated 
          ? (
            <>
              { isAdmin ? <AdminPortal /> : <PersonalityAssessments /> }
            </>
          )
          : <LogInOrCreateAnAccount /> 
        }
      </main>
    </>
  )
}