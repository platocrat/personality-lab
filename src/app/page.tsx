'use client';

// Externals
import { useState } from 'react'
import { Inter } from 'next/font/google'
// Locals
// Sections
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
import PersonalityAssessments from '@/sections/assessments'
// CSS
import styles from './page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  /**
   * @todo Set state of `isSignedIn` by using browser cookie
   */
  const [ isSignedIn, setIsSignedIn ] = useState<boolean>(false)

  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        { isSignedIn ? <PersonalityAssessments /> : <LogInOrCreateAnAccount /> }
      </main>
    </>
  )
}