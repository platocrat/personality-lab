'use client'

// Externals
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// Locals
import Header from '@/components/Header'
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import UserDemographicsLayout from '@/components/Layouts/UserDemographics'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
import { CurrentParticipantStudyContext } from '@/contexts/CurrentParticipantStudyContext'
// Types
import { 
  ACCOUNT__DYNAMODB, 
  BessiSkillScoresType, 
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'
// CSS
import './globals.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import BessiSkillScoresLayout from '@/components/Layouts/BessiSkillScoresLayout'
import CurrentParticipantStudyLayout from '@/components/Layouts/CurrentParticipantStudyLayout'



type UserType = { 
  email: string
  username: string 
  isAdmin: boolean
  isParticipant: boolean
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
}


export type UserResponse = {
  user: UserType | null
  error: Error | null
}




const INIT_USER = {
  email: '',
  username: '',
  isAdmin: false,
}




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // State variables for `UserType`
  const [ email, setEmail ] = useState<string>('')
  const [ username, setUsername ] = useState<string>('')
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const [ isParticipant, setIsParticipant ] = useState<boolean>(false)
  const [ userStudies, setUserStudies ] = useState<STUDY_SIMPLE__DYNAMODB[]>([])
  // Booleans for user authentication
  const [ isInviteUrl, setIsInviteUrl] = useState<boolean>(false)
  const [ isFetchingUser, setIsFetchingUser ] = useState<boolean>(true)
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)



  // --------------------------- Async functions -------------------------------
  async function getUser(): Promise<UserResponse> {
    try {
      const response = await fetch('/api/auth/user', { method: 'GET' })
      const json = await response.json()

      if (response.status === 401) return { user: null, error: json.message }
      if (response.status === 400) return { user: null, error: json.error }
      if (response.status === 500 && json.error.name === 'TokenExpiredError')
        return { user: null, error: json.error }

      const user_ = json.user as Omit<UserType, "studies">
      
      if (user_.isParticipant) {
        const userEmail = user_.email
        const userStudies_ = await getUserStudies(user_.email)
        const user = { ...user_, studies: userStudies_ }
        return { user, error: null }
      } else {
        const user = { ...user_, study: undefined }
        return { user, error: null }
      }
      
    } catch (error: any) {
      return { user: null, error: error }
    }
  }


  async function getUserStudies(
    userEmail: string
  ): Promise<STUDY_SIMPLE__DYNAMODB[] | undefined> {
    try {
      const apiEndpoint = `/api/account?email=${userEmail}`
      const response = await fetch(apiEndpoint, { method: 'GET' })
      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 404) throw new Error(json.message)
      if (response.status === 400) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      console.log(
        `[${new Date().toLocaleString() } --filepath="src/app/layout.tsx" --function="getUserStudies()"]: json: `, 
        json
      )

      const account = json.account as ACCOUNT__DYNAMODB
      const studies = account.studies as STUDY_SIMPLE__DYNAMODB[] | undefined
      return studies
    } catch (error: any) {
      throw new Error(error)
    }
  }


  /**
   * @dev Protects any page by restricting access to users that have already 
   *      authenticated and hold a session cookie.
   */
  async function pageProtection(): Promise<void> {
    setIsFetchingUser(true)

    const { user, error } = await getUser()


    if (error) {
      // Prompt user to log in 
      const timeout = 200 // 100 ms

      if (pathname !== undefined) {
        if (pathname.startsWith('/invite/')) {
          setIsInviteUrl(true)
          setIsFetchingUser(false)
          // End the if/else control statement here
          return 
        }

        pathname === '/' ? router.refresh() : router.push('/')
  
        setIsAuthenticated(false)
  
        // Avoid flashing the blocked page for a split second
        setTimeout(() => {
          setIsFetchingUser(false)
        }, timeout)

        return
      }
    } else {
      // Update state of the user
      setEmail((user as UserType).email)
      setUsername((user as UserType).username)
      setUserStudies((user as UserType).studies ?? [])
      // Update state of the kind of user
      setIsParticipant((user as UserType).isParticipant)
      setIsAdmin((user as UserType).isAdmin)
      // Show the dashboard
      setIsAuthenticated(true)
      setIsFetchingUser(false)
    }
  }


  // ------------------------------ `useEffect`s -------------------------------
  useEffect(() => {
    const requests = [
      pageProtection(),
    ]

    Promise.all(requests).then((response: any): void => { })
  }, [router, pathname])



  return (
    <>
      { isFetchingUser ? (
        <>
          <html lang='en'>
            <body>
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
            <body>
              <AuthenticatedUserContext.Provider
                value={{
                  email,
                  isAdmin,
                  username,
                  setEmail,
                  setIsAdmin,
                  userStudies,
                  setUsername,
                  isParticipant,
                  setUserStudies,
                  isAuthenticated,
                  setIsParticipant,
                  setIsAuthenticated,
                }}
              >
                <CurrentParticipantStudyLayout>
                  <UserDemographicsLayout>
                    <BessiSkillScoresLayout>
                      { isAuthenticated && <Header/> }
                      { children }
                    </BessiSkillScoresLayout>
                  </UserDemographicsLayout>
                </CurrentParticipantStudyLayout>
              </AuthenticatedUserContext.Provider>
            </body>
          </html>
        </>
      ) }
    </>
  )
}
