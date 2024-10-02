// Externals
import { usePathname } from 'next/navigation'
import { FC, ReactNode, useLayoutEffect, useState } from 'react'
// Locals
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Utils
import { 
  Player,
  GamePhases,
  haveAllPlayersCompleted,
  SocialRatingGamePlayers,
} from '@/utils'



type GameSessionLayoutProps = {
  children: ReactNode
}



const GameSessionLayout: FC<GameSessionLayoutProps> = ({
  children,
}) => {
  // Hooks
  const pathname = usePathname()
  // -------------------------------- States -----------------------------------
  // Customs
  const [ 
    players, 
    setPlayers 
  ] = useState<SocialRatingGamePlayers>({})
  // Enums
  const [ phase, setPhase ] = useState<GamePhases>(GamePhases.Lobby)
  // Strings
  const [ gameId, setGameId ] = useState<string>('')
  const [ sessionId, setSessionId ] = useState<string>('')
  const [ hostEmail, setHostEmail ] = useState<string>('')
  const [ sessionPin, setSessionPin ] = useState<string>('')
  const [ sessionQrCode, setSessionQrCode ] = useState<string>('')
  const [ gameSessionUrlSlug, setGameSessionUrlSlug ] = useState<string>('')
  // Booleans
  const [ 
    isUpdatingGameState, 
    setIsUpdatingGameState,
  ] = useState<boolean>(false)
  const [ isHost, setIsHost ] = useState<boolean>(false)
  const [ isGameSession, setIsGameSession ] = useState<boolean>(false)
  const [ isGameInSession, setIsGameInSession ] = useState<boolean>(false)


  // -------------------------- `useLayoutEffect`s -----------------------------
  useLayoutEffect(() => {
    let pathname_ = '',
      sessionId_ = ''

    const startIndex = '/social-rating/'.length
    const endIndex = startIndex + 'session'.length

    pathname_ = pathname.slice(startIndex, endIndex)
    sessionId_ = pathname.slice(endIndex + 1)

    if (pathname_ === 'session' && sessionId_ === sessionId) {
      setIsGameSession(true)
    } else {
      setIsGameSession(false)
    }
  }, [ pathname, sessionId ])





  return (
    <GameSessionContext.Provider 
      value={ { 
        phase,
        gameId,
        isHost,
        players,
        hostEmail,
        sessionId, 
        sessionPin, 
        sessionQrCode,
        isGameSession,
        isGameInSession,
        gameSessionUrlSlug,
        isUpdatingGameState,
        // Setters
        setPhase,
        setIsHost,
        setGameId,
        setPlayers,
        setSessionId, 
        setHostEmail,
        setSessionPin, 
        setSessionQrCode,
        setIsGameSession,
        setIsGameInSession,
        setGameSessionUrlSlug,
        setIsUpdatingGameState,
      } }
    >
      { children }
    </GameSessionContext.Provider>
  )
}


export default GameSessionLayout