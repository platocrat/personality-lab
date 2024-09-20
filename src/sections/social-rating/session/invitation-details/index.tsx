// Externals
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  FC, 
  useMemo, 
  useState,
  ReactNode, 
  useContext, 
  useLayoutEffect, 
} from 'react'
// Locals
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/contexts//GameSessionContext'
// Hooks
import useGameTitle from '@/hooks/useGameTitle'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css'



type InvitationDetailsProps = {
  isLobby: boolean
  children?: ReactNode
}



const InvitationDetails: FC<InvitationDetailsProps> = ({
  isLobby,
  children,
}) => {
  // Contexts
  const {
    gameId,
    sessionId,
    sessionPin,
    sessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()
  const gameTitle = useGameTitle(gameId, sessionId)

  

  return (
    <>
      <div className={ styles['session-invitation-details'] }>
        <div className={ styles['top-container'] }>
          <div className={ styles['content-container'] }>
            <div className={ styles.container }>
              { !isLobby && (
                <>
                  <div className={ styles.label }>
                    { `You are hosting a game session for:` }
                  </div>
                  <div className={ styles['first-value'] }>
                    { gameTitle }
                  </div>
                </>
              ) }

              <div className={ styles.section }>
                <div>
                  <div>
                    <div className={ styles.label }>{ `Session URL:` }</div>
                    <div className={ styles.value }>
                      { `${window.location.origin}/social-rating/session/${sessionId}` }
                    </div>
                  </div>
                  <div className={ styles.label }>
                    { `Session PIN:` }
                  </div>
                  <div 
                    className={ 
                      `${styles.value} ${styles['wide-letter-spacing']} ${styles['xx-large-font']}`
                    }
                  >
                    { `${ sessionPin.slice(0, 3) } ${sessionPin.slice(3, 6) }` }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={ styles['qr-code-container'] }>
            { sessionQrCode && (
              <div>
                <Image
                  width={ 144 }
                  height={ 144 }
                  alt='QR Code'
                  src={ sessionQrCode }
                  className={ styles['qr-code'] }
                />
              </div>
            ) }
          </div>
        </div>

        <div className={ styles['children-container'] }>
          { children }
        </div>
      </div>
    </>
  )
}


export default InvitationDetails