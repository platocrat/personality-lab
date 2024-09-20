// Externals
import { usePathname } from 'next/navigation'
import { createContext, useState, ReactNode, useLayoutEffect, FC } from 'react'
// Locals
import useOrigin from '@/hooks/useOrigin'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { SocialRatingGamePlayers } from '@/utils'



type GameSessionLayoutProps = {
  children: ReactNode
}



const GameSessionLayout: FC<GameSessionLayoutProps> = ({
  children,
}) => {
  // Hooks
  const origin = useOrigin()
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
  const [ isGameSession, setIsGameSession ] = useState<boolean>(false)
  const [ gameSessionUrl, setGameSessionUrl ] = useState<string>('Loading...')



  // Call the API to shorten the `gameSessionUrl`
  async function getGameSessionUrl() {
    const originalUrl = `${origin}/social-rating/session/${sessionId}`

    try {
      const response = await fetch('/api/url/shorten', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl
        }),
      })

      const { shortenedUrl } = await response.json()

      if (shortenedUrl) setGameSessionUrl(shortenedUrl)
    } catch (error: any) {
      throw new Error('Error shortening the URL: ', error)
    }
  }


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
  
  
  useLayoutEffect(() => {
    if (sessionId !== '') {
      const requests = [
        getGameSessionUrl(),
      ]
  
      Promise.all(requests).then(() => {})
    }
  }, [ sessionId ])




  return (
    <GameSessionContext.Provider 
      value={ { 
        gameId,
        isHost,
        players,
        hostEmail,
        sessionId, 
        sessionPin, 
        sessionQrCode,
        isGameSession,
        gameSessionUrl,
        // Setters
        setIsHost,
        setGameId,
        setPlayers,
        setSessionId, 
        setHostEmail,
        setSessionPin, 
        setSessionQrCode,
        setIsGameSession,
        setGameSessionUrl,
      } }
    >
      { children }
    </GameSessionContext.Provider>
  )
}


export default GameSessionLayout