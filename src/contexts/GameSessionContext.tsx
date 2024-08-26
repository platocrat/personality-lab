// Externals
import { createContext, useState, ReactNode } from 'react'
// Locals
import { GameSessionContextType } from './types'


export const GameSessionContext = createContext<GameSessionContextType>({
  sessionId: null,
  sessionPin: null,
  sessionQrCode: null,
  setSessionId: null,
  setSessionPin: null,
  setSessionQrCode: null,
})

export const GameSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState('')
  const [sessionPin, setSessionPin] = useState('')
  const [sessionQrCode, setSessionQrCode] = useState('')

  return (
    <GameSessionContext.Provider 
      value={ { 
        sessionId, 
        sessionPin, 
        sessionQrCode, 
        setSessionId, 
        setSessionPin, 
        setSessionQrCode 
      } }
    >
      { children }
    </GameSessionContext.Provider>
  )
}