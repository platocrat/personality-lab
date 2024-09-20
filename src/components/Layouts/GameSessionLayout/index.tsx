// Externals
import { usePathname } from 'next/navigation'
import { FC, ReactNode, useLayoutEffect, useState } from 'react'
// Locals
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Utils
import { GamePhases, SocialRatingGamePlayers } from '@/utils'



type GameSessionLayoutProps = {
  children: ReactNode
}



const GameSessionLayout: FC<GameSessionLayoutProps> = ({
  children,
}) => {
  // Hooks
  const pathname = usePathname()
  // States
  const [ 
    players, 
    setPlayers 
  ] = useState<SocialRatingGamePlayers>({})
  const [ gameId, setGameId ] = useState<string>('')
  const [ isHost, setIsHost ] = useState<boolean>(false)
  const [ sessionId, setSessionId ] = useState<string>('')
  const [ hostEmail, setHostEmail ] = useState<string>('')
  const [ sessionPin, setSessionPin ] = useState<string>('')
  const [ sessionQrCode, setSessionQrCode ] = useState<string>('')
  const [ phase, setPhase ] = useState<GamePhases>(GamePhases.Lobby)
  const [ isGameSession, setIsGameSession ] = useState<boolean>(false)
  const [ isGameInSession, setIsGameInSession ] = useState<boolean>(false)
  const [ gameSessionUrlSlug, setGameSessionUrlSlug ] = useState<string>('')
  


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
      } }
    >
      { children }
    </GameSessionContext.Provider>
  )
}


export default GameSessionLayout