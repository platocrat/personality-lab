// Externals
import { createContext } from 'react'
// Locals
import { SessionContextType } from './types'



const INIT_SESSION_CONTEXT: SessionContextType = {
  email: '',
  // username: string
  accountError: '',
  isGlobalAdmin: false,
  isParticipant: false,
  isAuthenticated: false,
  studiesAsAdmin: [],
  userStudies: [], // `undefined` for a non-participant
  participant: undefined,
  isFetchingSession: false,
  setEmail: () => {},
  // setUsername: Dispatch<SetStateAction<string>>
  setUserStudies: () => {},
  setIsGlobalAdmin: () => {},
  setIsParticipant: () => {},
  setIsAuthenticated: () => {},
}



export const SessionContext = createContext<SessionContextType>(
  INIT_SESSION_CONTEXT
)