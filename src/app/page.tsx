// Externals
import { Inter } from 'next/font/google'
import { useContext, useEffect, useState } from 'react'
// Locals
// Sections
import PersonalityAssessments from '@/sections/assessments'
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import styles from './page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const { isAuthenticated } = useContext(AuthenticatedUserContext)


  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        { isAuthenticated ? <PersonalityAssessments /> : <LogInOrCreateAnAccount /> }
      </main>
    </>
  )
}