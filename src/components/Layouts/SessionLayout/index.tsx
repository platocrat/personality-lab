// Externals
import { usePathname, useRouter } from 'next/navigation'
import { FC, ReactNode, useLayoutEffect, useState } from 'react'
// Locals
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Utils
import {
  StudyAsAdmin,
  ACCOUNT__DYNAMODB,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB,
} from '@/utils'


// --------------------------------- Types -------------------------------------
type SessionLayoutProps = {
  children: ReactNode
}


export type SessionType = {
  email: string
  // username: string
  isGlobalAdmin: boolean
  isParticipant: boolean
  studiesAsAdmin?: StudyAsAdmin[] // `undefined` for non-study-admins
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
}


export type SessionResponse = {
  session?: SessionType
  error?: Error
}



// -------------------------- React function component -------------------------
const SessionLayout: FC<SessionLayoutProps> = ({
  children,
}) => {
  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  // State variables for `SessionType`
  const [
    studiesAsAdmin,
    setStudiesAsAdmin
  ] = useState<StudyAsAdmin[] | undefined>(undefined)
  const [
    participant,
    setParticipant,
  ] = useState<PARTICIPANT__DYNAMODB | undefined>(undefined)
  const [
    userStudies,
    setUserStudies
  ] = useState<STUDY_SIMPLE__DYNAMODB[] | undefined>(undefined)
  const [email, setEmail] = useState<string>('')
  // const [ username, setUsername ] = useState<string>('')
  const [accountError, setAccountError] = useState<string>('')
  const [isGlobalAdmin, setIsGlobalAdmin] = useState<boolean>(false)
  const [isParticipant, setIsParticipant] = useState<boolean>(false)
  // Booleans for user authentication
  const [isInviteUrl, setIsInviteUrl] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingSession, setIsFetchingSession] = useState<boolean>(true)



  // --------------------------- Async functions -------------------------------
  async function getSession(): Promise<SessionResponse> {
    try {
      // First get the user's basic information from their JWT cookie
      const response = await fetch('/api/v1/auth/user', { method: 'GET' })
      const json = await response.json()

      if (response.status === 401) return { session: undefined, error: json.message }
      if (response.status === 400) return { session: undefined, error: json.error }
      if (response.status === 500 && json.error.name === 'TokenExpiredError')
        return { session: undefined, error: json.error }

      const user_ = json.user as Omit<SessionType, "studies">

      if (user_.isParticipant) {
        const userEmail = user_.email
        const userStudies_ = await getUserStudies(user_.email)
        const session = { ...user_, studies: userStudies_ }
        return { session, error: undefined }
      } else {
        const session = { ...user_, study: undefined }
        return { session, error: undefined }
      }

    } catch (error: any) {
      return { session: undefined, error, }
    }
  }


  /**
   * @dev Returns `studies` for a given user's email. Called after the user has 
   *      been authenticated with a JWT in `getSession()`.
   * @param userEmail 
   * @returns studies
   */
  async function getUserStudies(
    userEmail: string
  ): Promise<STUDY_SIMPLE__DYNAMODB[] | undefined> {
    try {
      const apiEndpoint = `/api/v1/account?email=${userEmail}`
      const response = await fetch(apiEndpoint, { method: 'GET' })
      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 404) throw new Error(json.message)
      if (response.status === 400) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      const account = json.account as ACCOUNT__DYNAMODB
      const participant = account.participant as PARTICIPANT__DYNAMODB | undefined
      const studies = participant?.studies as STUDY_SIMPLE__DYNAMODB[] | undefined
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
    const { session, error } = await getSession()

    if (error) {
      // Prompt user to log in 
      const timeout = 200 // 200 ms

      if (pathname !== undefined) {
        if (
          pathname.startsWith('/invite/') || 
          pathname.startsWith('/social-rating/session/')
        ) {
          setIsInviteUrl(true)
          setIsFetchingSession(false)
          // End the if/else control statement here
          return
        }

        pathname === '/' ? router.refresh() : router.push('/')

        setIsAuthenticated(false)

        // Avoid flashing the blocked page for a split second
        setTimeout(() => {
          setIsFetchingSession(false)
        }, timeout)

        return
      }
    } else {
      // Update state of the user's session
      setEmail((session as SessionType).email)
      // setUsername((session as SessionType).username)
      setUserStudies((session as SessionType).studies ?? [])
      setStudiesAsAdmin((session as SessionType).studiesAsAdmin ?? [])
      // Update state of the kind of user
      setIsParticipant((session as SessionType).isParticipant)
      setIsGlobalAdmin((session as SessionType).isGlobalAdmin)
      // Show the dashboard
      setIsAuthenticated(true)
      setIsFetchingSession(false)

      return
    }
  }


  // ------------------------------ `useEffect`s -------------------------------
  useLayoutEffect(() => {
    const requests = [
      pageProtection(),
    ]

    Promise.all(requests).then((response: any): void => { })
  }, [ pathname ])





  return (
    <>
      <SessionContext.Provider
        value={ {
          email,
          // username,
          participant,
          userStudies,
          // setUsername,
          accountError,
          isGlobalAdmin,
          isParticipant,
          studiesAsAdmin,
          isAuthenticated,
          isFetchingSession,
          setEmail,
          setUserStudies,
          setIsParticipant,
          setIsGlobalAdmin,
          setIsAuthenticated,
        } }
      >
        { children }
      </SessionContext.Provider>
    </>
  )
}


export default SessionLayout