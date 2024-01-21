'use client'

// Externals
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type UserResponse = {
  user: any | null
  error: Error | null
}


const inter = Inter({ subsets: ['latin'] })


const DashboardLayout = ({
  children,
}: {
  children: ReactNode
}) => {
  const router = useRouter()

  const [ retrievedUser, setRetrievedUser ] = useState<boolean>(false)

  // --------------------------- Async functions -------------------------------
  async function getUser(): Promise<UserResponse> {
    try {
      const response = await fetch('/dashboard/api/get-user')
      const data = await response.json()

      if (response.status === 401) return { user: null, error: data.message }
      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error }
    }
  }

  /**
   * @dev Protects the `/dashboard` page by restricting access to users that
   * have already authenticated and hold a session cookie.
   */
  async function protectPage(): Promise<void> {
    const { user, error } = await getUser()

    if (error) {
      router.push('/')
      return
    } else {
      setRetrievedUser(true)
    }
  }


  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    const requests = [
      protectPage()
    ]

    Promise.all(requests).then((response: any): void => { })
  }, [router])



  return (
    <>
      { retrievedUser ? (
        <>
          <main className={ `${styles.main} ${inter.className}` }>
            { children }
          </main>
        </>
      ) : (
        <>
          <div 
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
            } }
          >
            <Spinner height='60' width='60' />
          </div>
        </>
      ) }
    </>
  )
}

export default DashboardLayout