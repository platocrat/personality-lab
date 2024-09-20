// Externals
import { createContext } from 'react'
// Locals
import { GamePhases } from '@/utils'
import { GameSessionContextType } from '@/contexts/types'



const INIT_GAME_SESSION_CONTEXT: GameSessionContextType = {
  gameId: '',
  players: {},
  isHost: false,
  hostEmail: '',
  sessionId: '',
  sessionPin: '',
  sessionQrCode: '',
  isGameSession: false,
  gameSessionUrlSlug: '',
  phase: GamePhases.Lobby,
  setPhase: () => { },
  setIsHost: () => { },
  setGameId: () => { },
  setPlayers: () => { },
  setHostEmail: () => { },
  setSessionId: () => { },
  setSessionPin: () => { },
  setSessionQrCode: () => { },
  setIsGameSession: () => { },
  setGameSessionUrlSlug: () => { },
}



export const GameSessionContext = createContext<GameSessionContextType>(
  INIT_GAME_SESSION_CONTEXT
)