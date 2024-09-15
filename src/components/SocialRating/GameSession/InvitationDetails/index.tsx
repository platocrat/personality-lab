// Externals
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FC, useContext, useLayoutEffect, useMemo, useState } from 'react'
// Locals
// Contexts
import { GameSessionContextType } from '@/contexts/types'
import { GameSessionContext } from '@/contexts//GameSessionContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/SocialRating/InitiateGame/InitiateGame.module.css'



type InvitationDetailsProps = {
  isLobby: boolean
}



const InvitationDetails: FC<InvitationDetailsProps> = ({
  isLobby,
}) => {
  // Contexts
  const {
    gameId,
    sessionId,
    sessionPin,
    sessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [gameTitle, setGameTitle] = useState<string>('')


  // -------------------------- `useLayoutEffect`s -----------------------------
  useLayoutEffect(() => {
    if (gameId) {
      let _

      switch (gameId) {
        case 'bessi':
          _ = 'The BESSI'
          break
        case 'fictional-characters':
          _ = 'Gen AI Fictional Characters'
          break
        default:
          _ = 'No game ID was found'
          break
      }

      setGameTitle(_)
    }
  }, [gameId])


  

  return (
    <>
      <div className={ styles['session-invitation-details'] }>
        <div className={ styles['content-container'] }>
          <div className={ styles.container }>
            { !isLobby && (
              <>
                <div className={ styles.label }>
                  { `Hosting a new game session for:` }
                </div>
                <div className={ styles['first-value'] }>{ gameTitle }</div>
              </>
            ) }

            <div className={ styles.section }>
              <div>
                <div className={ styles.label }>{ `Session ID:` }</div>
                <div className={ styles.value }>{ sessionId }</div>
              </div>
              <div>
                <div className={ styles.label }>{ `Session PIN:` }</div>
                <div className={ styles.value }>{ sessionPin }</div>
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
    </>
  )
}


export default InvitationDetails