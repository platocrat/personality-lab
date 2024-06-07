'use client'

// Externals
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useContext, useEffect, useMemo, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import MainPortal from '@/sections/main-portal'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'




const Spinner_ = () => {
  return (
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
  )
}




export default function Home() {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const router = useRouter()
  // State
  const [ isAuthenticated, setIsAuthenticated ] = useState(false)
  

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    } else {
      if (user !== undefined) {
        console.log(`user: `, user)
        setIsAuthenticated(false)
      }
    }
  }, [ isLoading, user, error, router ])


  return (
    <>
      <main>
        { isLoading || !user ? <Spinner_ /> :  <MainPortal /> }
      </main>
    </>
  )
}