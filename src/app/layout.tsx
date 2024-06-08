'use client'

// Externals
// import * as Castle from '@castleio/castle-js'
import { useLayoutEffect, useState } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0/client'
// Locals
import Header from '@/components/Header'
import Spinner from '@/components/Suspense/Spinner'
import ProgressBar from '@/components/Progress/ProgressBar'
import BessiSkillScoresLayout from '@/components/Layouts/BessiSkillScoresLayout'
import UserDemographicsLayout from '@/components/Layouts/UserDemographics'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Types
import {
  ACCOUNT__DYNAMODB,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB
} from '@/utils'
// CSS
import './globals.css'
import { definitelyCenteredStyle } from '@/theme/styles'



export type SessionType = { 
  email: string
  username: string 
  isAdmin: boolean
  isParticipant: boolean
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
}


export type SessionResponse = {
  session: SessionType | null
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
  // const router = useRouter()
  // const pathname = usePathname()

  // State variables for `SessionType`
  const [ email, setEmail ] = useState<string>('')
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const [ isParticipant, setIsParticipant ] = useState<boolean>(false)
  const [ userStudies, setUserStudies ] = useState<STUDY_SIMPLE__DYNAMODB[]>([])
  // Booleans for user authentication
  const [ isInviteUrl, setIsInviteUrl] = useState<boolean>(false)
  const [ isFetchingUser, setIsFetchingUser ] = useState<boolean>(true)
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)



  // --------------------------- Async functions -------------------------------
  // async function getSession(): Promise<SessionResponse> {
  //   try {
  //     // First get the user's basic information from their JWT cookie
  //     const response = await fetch('/api/auth/user', { method: 'GET' })
  //     const json = await response.json()

  //     if (response.status === 401) return { session: null, error: json.message }
  //     if (response.status === 400) return { session: null, error: json.error }
  //     if (response.status === 500 && json.error.name === 'TokenExpiredError')
  //       return { session: null, error: json.error }

  //     const user_ = json.user as Omit<SessionType, "studies">
      
  //     if (user_.isParticipant) {
  //       const userEmail = user_.email
  //       const userStudies_ = await getUserStudies(user_.email)
  //       const session = { ...user_, studies: userStudies_ }
  //       return { session, error: null }
  //     } else {
  //       const session = { ...user_, study: undefined }
  //       return { session, error: null }
  //     }
      
  //   } catch (error: any) {
  //     return { session: null, error: error }
  //   }
  // }


  /**
   * @dev Returns `studies` for a given user's email. Called after the user has 
   *      been authenticated with a JWT in `getSession()`.
   * @param userEmail 
   * @returns studies
   */
  // async function getUserStudies(
  //   userEmail: string
  // ): Promise<STUDY_SIMPLE__DYNAMODB[] | undefined> {
  //   try {
  //     const apiEndpoint = `/api/account?email=${userEmail}`
  //     const response = await fetch(apiEndpoint, { method: 'GET' })
  //     const json = await response.json()

  //     if (response.status === 400) throw new Error(json.error)
  //     if (response.status === 404) throw new Error(json.message)
  //     if (response.status === 400) throw new Error(json.error)
  //     if (response.status === 500) throw new Error(json.error)

  //     console.log(
  //       `[${new Date().toLocaleString() } --filepath="src/app/layout.tsx" --function="getUserStudies()"]: json: `, 
  //       json
  //     )

  //     const account = json.account as ACCOUNT__DYNAMODB
  //     const participant = account.participant as PARTICIPANT__DYNAMODB | undefined
  //     const studies = participant?.studies as STUDY_SIMPLE__DYNAMODB[] | undefined
  //     return studies
  //   } catch (error: any) {
  //     throw new Error(error)
  //   }
  // }


  /**
   * @dev Protects any page by restricting access to users that have already 
   *      authenticated and hold a session cookie.
   */
  // async function pageProtection(): Promise<void> {
  //   const { session, error } = await getSession()


  //   if (error) {
  //     // Prompt user to log in 
  //     const timeout = 200 // 100 ms

  //     if (pathname !== undefined) {
  //       if (pathname.startsWith('/invite/')) {
  //         setIsInviteUrl(true)
  //         setIsFetchingUser(false)
  //         // End the if/else control statement here
  //         return 
  //       }

  //       pathname === '/' ? router.refresh() : router.push('/')
  
  //       setIsAuthenticated(false)
  
  //       // Avoid flashing the blocked page for a split second
  //       setTimeout(() => {
  //         setIsFetchingUser(false)
  //       }, timeout)

  //       return
  //     }
  //   } else {
  //     // Update state of the user's session
  //     setEmail((session as SessionType).email)
  //     setUsername((session as SessionType).username)
  //     setUserStudies((session as SessionType).studies ?? [])
  //     // Update state of the kind of user
  //     setIsParticipant((session as SessionType).isParticipant)
  //     setIsAdmin((session as SessionType).isAdmin)
  //     // Show the dashboard
  //     setIsAuthenticated(true)
  //     setIsFetchingUser(false)
  //   }
  // }




  return (
    <>
      <html lang='en'>
        <body>
          <ProgressBar>
            <UserProvider>
              {/**
                * @todo Finish Auth0 integration by replacing everywhere 
                *       necessary the use of the custom`SessionContext` with 
                *       Auth0's `useUser()` hook.
                */}
              <UserDemographicsLayout>
                <BessiSkillScoresLayout>
                  <Header/>
                  { children }
                </BessiSkillScoresLayout>
              </UserDemographicsLayout>
            </UserProvider>
          </ProgressBar>
        </body>
      </html>
    </>
  )
}
