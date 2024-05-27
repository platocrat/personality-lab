'use client'

// Externals
import { useContext, useMemo } from 'react'
// Locals
// Sections
import MainPortal from '@/sections/main-portal'
import LogInOrCreateAnAccount from '@/sections/log-in-or-create-an-account'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import styles from '@/app/page.module.css'





export default function Home() {
  const { isAuthenticated } = useContext(AuthenticatedUserContext)


  return (
    <>
      <main>
        { isAuthenticated ? <MainPortal /> : <LogInOrCreateAnAccount /> }
      </main>
    </>
  )
}