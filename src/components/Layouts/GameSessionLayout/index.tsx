// Externals
import { createContext, useState, ReactNode } from 'react'
// Locals
import { GameSessionContextType } from '@/contexts/types'



const INIT_GAME_SESSION_CONTEXT = {
  gameId: null,
  sessionId: null,
  sessionPin: null,
  sessionQrCode: null,
  setGameId: null,
  setSessionId: null,
  setSessionPin: null,
  setSessionQrCode: null,
}


export const GameSessionContext = createContext<GameSessionContextType>(
  INIT_GAME_SESSION_CONTEXT
)



const GameSessionLayout = ({ children }: { children: ReactNode }) => {
  const [ gameId, setGameId ] = useState('')
  const [ sessionId, setSessionId ] = useState('')
  const [ sessionPin, setSessionPin ] = useState('')
  const [ sessionQrCode, setSessionQrCode ] = useState('')

  return (
    <GameSessionContext.Provider 
      value={ { 
        gameId,
        sessionId, 
        sessionPin, 
        sessionQrCode,
        setGameId,
        setSessionId, 
        setSessionPin, 
        setSessionQrCode 
      } }
    >
      { children }
    </GameSessionContext.Provider>
  )
}


export default GameSessionLayout