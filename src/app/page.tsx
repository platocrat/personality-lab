'use client'

// Externals
import { useContext, useMemo } from 'react'
// Locals
// Sections
import MainPortal from '@/sections/main-portal'
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// CSS
import styles from '@/app/page.module.css'





export default function Home() {
  const { isAuthenticated } = useContext<SessionContextType>(SessionContext)


  return (
    <>
      <main>
        { isAuthenticated ? <MainPortal /> : <LogInOrCreateAnAccount /> }
      </main>
    </>
  )
}