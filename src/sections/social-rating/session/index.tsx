'use client'

// Externals
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import GameSession from '@/components/SocialRating/GameSession'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// Hooks
import useGameTitle from '@/hooks/useGameTitle'
import useStoredNickname from '@/hooks/useStoredNickname'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type SocialRatingSessionProps = {
}



const SocialRatingSession: FC<SocialRatingSessionProps> = ({
}) => {
  // Contexts
  const {
    gameId,
    players,
    sessionId,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const storedNickname = useStoredNickname()
  const gameTitle = useGameTitle(gameId, sessionId)

  // Check if nickname is in players list
  const isPlayerInGame = players ? players[storedNickname.nickname] : false


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
          <div style={ { margin: '48px' } }>
            { isPlayerInGame && storedNickname.nickname ? (
              <>
                <h2 style={ { ...definitelyCenteredStyle } }>
                  { `Welcome, ${storedNickname.nickname}!` }
                </h2>
              </>
            ) : (
              <>
                <h2 style={ { ...definitelyCenteredStyle } }>
                    { `Waiting for other players...` }
                </h2>
              </>
            ) }
          </div>
        </GameSession>
      </div>
    </>
  )
}


export default SocialRatingSession