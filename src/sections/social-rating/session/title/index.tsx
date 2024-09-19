// Externals
import { useContext } from 'react'
// Locals
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Hooks
import useGameTitle from '@/hooks/useGameTitle'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



const Title = () => {
  // Contexts
  const {
    gameId,
    sessionId,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const gameTitle = useGameTitle(gameId, sessionId)



  return (
    <>
      <div
        style={ {
          ...definitelyCenteredStyle,
          marginBottom: '12px',
          textAlign: 'center',
        } }
      >
        <h1>{ gameTitle }</h1>
      </div>
    </>
  )
}

export default Title