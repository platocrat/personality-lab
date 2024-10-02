// Externals
import { FC, Fragment, useContext, useLayoutEffect, useState } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import InvitationDetails from '@/sections/social-rating/session/invitation-details'
// Contexts
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType } from '@/contexts/types'
// Utils
import { GamePhases } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css'



type SessionLobbyProps = {
  onClick: () => void
}




const SessionLobby: FC<SessionLobbyProps> = ({
  onClick,
}) => {
  // Contexts
  const {
    phase,
    isHost,
    players,
    isUpdatingGameState,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ canStartGame, setCanStartGame ] = useState<boolean>(false)


  useLayoutEffect(() => {
    if (isHost) {
      if (players) {
        const numPlayers = Object.keys(players).length
        if (numPlayers > 1) setCanStartGame(true)
      }
    }
  }, [isHost, players])




  return (
    <>
      <div className={ styles['lobby-container'] }>
        <InvitationDetails isLobby={ phase === GamePhases.Lobby } />

        { isUpdatingGameState ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                top: '11.5px',
                margin: '17.85px',
              } }
            >
              <Spinner height='30' width='30' />
            </div>
          </>
        ) : (
          <>
            { canStartGame && (
              <div
                style={ { marginTop: '24px' } }
              >
                <button
                  className={ styles['input-button'] }
                  onClick={ onClick } // Call the function when clicked
                >
                  { `Start Game` }
                </button>
              </div>
            ) }
          </>
        )}

        <div className={ styles['player-nickname-grid'] }>
          { players && Object.keys(players).length > 0 ? (
            <>
              { Object.keys(players).map((
                _nickname: string,
                i: number
              ) => (
                <Fragment key={ i }>
                  <h2 className={ styles['player-nickname'] }>
                    { _nickname }
                  </h2>
                </Fragment>
              )) }
            </>
          ) : (
            <>
              <h2>
                { `Waiting for other players...` }
              </h2>
            </>
          ) }
        </div>
      </div>
    </>
  )
}

export default SessionLobby