'use client'

// Externals
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// Locals
import Header from '@/components/Header'
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { 
  BessiSkillScoresContextComponent 
} from '@/contexts/BessiSkillScoresContext'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import './globals.css'
import { definitelyCenteredStyle } from '@/theme/styles'


export type UserResponse = {
  user: any | null
  error: Error | null
}


const inter = Inter({ subsets: ['latin'] })


const metadata: Metadata = {
  title: 'Personality Lab',
  description: 'Take a personality test and learn about yourself. See your results immediately after the survey.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Booleans
  const [ isFetchingUser, setIsFetchingUser ] = useState<boolean>(true)
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)

  // --------------------------- Async functions -------------------------------
  async function getUser(): Promise<UserResponse> {
    try {
      const response = await fetch('/api/get-user', { method: 'GET' })
      const data = await response.json()

      if (response.status === 401) return { user: null, error: data.message }
      if (response.status === 400) return { user: null, error: data.error }
      // Assumes `response.status === 200 && data.message === 'User authenticated'`
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error }
    }
  }

  /**
   * @dev Protects any page by restricting access to users that
   * have already authenticated and hold a session cookie.
   */
  async function pageProtection(): Promise<void> {
    const { user, error } = await getUser()

    if (error) {
      // Prompt user to log in 
      const timeout = 200 // 100 ms

      if (pathname !== undefined) {
        pathname === '/' ? router.refresh() : router.push('/')
  
        setIsAuthenticated(false)
  
        // Avoid flashing the blocked page for a split second
        setTimeout(() => {
          setIsFetchingUser(false)
        }, timeout)
      }
    } else {
      // Show the dashboard
      setIsAuthenticated(true)
      setIsFetchingUser(false)
    }
  }


  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    const requests = [
      pageProtection()
    ]

    Promise.all(requests).then((response: any): void => { })
  }, [router, pathname])



  return (
    <>
      { isFetchingUser ? (
        <>
          <html lang='en'>
            <body className={ inter.className }>
              <div
                style={ {
                  ...definitelyCenteredStyle,
                  position: 'relative',
                  top: '80px',
                } }
              >
                <Spinner height='40' width='40' />
              </div>
            </body>
          </html>
        </>
      ) : (
        <>
          <html lang='en'>
            <body className={ inter.className }>
              <AuthenticatedUserContext.Provider
                value={ {
                  isAuthenticated: isAuthenticated,
                  setIsAuthenticated: setIsAuthenticated,
                } }
              >
                <BessiSkillScoresContextComponent>
                  { isAuthenticated && <Header/> }
                  { children }
                </BessiSkillScoresContextComponent>
              </AuthenticatedUserContext.Provider>
            </body>
          </html>
        </>
      ) }
    </>
  )
}
