'use client';

// Internals
import { createContext, useState } from 'react'


export const AuthenticatedUserContext = createContext<any>(null)


export const AuthenticatedUserContextComponent = ({ children }) => {
  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(false)

  return (
    <>
      <AuthenticatedUserContext.Provider
        value= { {
          isAuthenticated,
            setIsAuthenticated,
        }}
      >
        { children }
      </AuthenticatedUserContext.Provider>
    </>
  )
}