'use client'

// Externals
import { FC, useContext, useLayoutEffect, useMemo, useState } from 'react'
// Locals
import GameSession from '@/components/SocialRating/GameSession'
// Contexts
import { GameSessionContext } from '@/components/Layouts/GameSessionLayout'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type SocialRatingSessionSectionProps = {
}



const SocialRatingSessionSection: FC<SocialRatingSessionSectionProps> = ({
}) => {
  // Contexts
  const {
    gameId
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ gameTitle, setGameTitle ] = useState<string>('')


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
        <div style={{ ...definitelyCenteredStyle, marginBottom: '12px' }}>
          <h2>{ gameTitle }</h2>
        </div>

        <GameSession isLobby={ true }>
          {/* Game content */}
          <div>

          </div>
        </GameSession>
      </div>
    </>
  )
}


export default SocialRatingSessionSection