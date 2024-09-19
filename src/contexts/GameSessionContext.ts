// Externals
import { createContext } from 'react'
// Locals
import { GameSessionContextType } from './types'


const INIT_GAME_SESSION_CONTEXT: GameSessionContextType = {
  gameId: '',
  players: {},
  isHost: false,
  hostEmail: '',
  sessionId: '',
  sessionPin: '',
  sessionQrCode: '',
  isGameSession: false,
  setIsHost: () => { },
  setGameId: () => { },
  setPlayers: () => { },
  setHostEmail: () => { },
  setSessionId: () => { },
  setSessionPin: () => { },
  setSessionQrCode: () => { },
  setIsGameSession: () => { },
}



export const GameSessionContext = createContext<GameSessionContextType>(
  INIT_GAME_SESSION_CONTEXT
)