'use client';

// Externals
import { Inter } from 'next/font/google'
import { useContext, useMemo } from 'react'
// Locals
// Sections
import PersonalityAssessments from '@/sections/assessments'
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import styles from '@/app/page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const { isAuthenticated } = useContext(AuthenticatedUserContext)

  const _isAuthenticated = useMemo((): boolean => {
    return isAuthenticated
  }, [isAuthenticated])


  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        { _isAuthenticated ? <PersonalityAssessments /> : <LogInOrCreateAnAccount /> }
      </main>
    </>
  )
}