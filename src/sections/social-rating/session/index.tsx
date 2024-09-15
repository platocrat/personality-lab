'use client'

// Externals
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import GameSession from '@/components/SocialRating/GameSession'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type SocialRatingSessionProps = {
}



const SocialRatingSession: FC<SocialRatingSessionProps> = ({
}) => {
  // Contexts
  const {
    gameId,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ gameTitle, setGameTitle ] = useState<string>('')


  // ----------------------------`useLayoutEffect`s ----------------------------
  // Sets the game title
  useLayoutEffect(() => {
    if (gameId) {
      let _

      switch (gameId) {
        case 'bessi':
          _ = 'The BESSI'
          break
        case 'fictional-characters':
          _ = 'AI-generated Fictional Characters'
          break
        default: 
          _ = 'No game ID was found'
          break
      }

      setGameTitle(_)
    }
  }, [ gameId ])




  return (
    <>
      <div>
        <div 
          style={{ 
            ...definitelyCenteredStyle, 
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          <h1>{ gameTitle }</h1>
        </div>

        <GameSession isLobby={ true }>
          {/* Game content */}
          <div style={{ margin: '48px' }}>
            <h2 style={{ ...definitelyCenteredStyle }}>
              { `Waiting for other players...` }
            </h2>
          </div>
        </GameSession>
      </div>
    </>
  )
}


export default SocialRatingSession