// Externals
import Image from 'next/image'
import { FC, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
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
        <div style={ { ...definitelyCenteredStyle } }>
          <div
            style={ {
              display: 'flex',
              textAlign: 'left',
              flexDirection: 'column',
            } }
          >
            { !isLobby && (
              <>
                <div
                  style={ {
                    fontWeight: '500',
                    margin: '0px 0px 24px 0px',
                  } }
                >
                  { `Hosting a new game session for:` }
                </div>
                <div style={ { display: 'grid', margin: '0px 0px 24px 0px' } }>
                  <div style={ { textAlign: 'center', fontWeight: '700' } }>
                    { `${gameTitle}` }
                  </div>
                </div>
              </>
            )}

            <div
              style={ {
                gap: '8px',
                display: 'grid',
                color: 'rgb(0, 90, 194)',
              } }
            >
              <div style={ { display: 'grid', gap: '8px' } }>
                <div>{ `Session ID:` }</div>
                <div style={ { textAlign: 'center', fontWeight: '700' } }>
                  { `${sessionId}` }
                </div>
              </div>
              <div
                style={ {
                  gap: '8px',
                  display: 'grid',
                  marginTop: '8px',
                } }
              >
                <div>{ `Session PIN:` }</div>
                <div
                  style={ {
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: '20px',
                  } }
                >
                  { `${sessionPin}` }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={ {
            ...definitelyCenteredStyle,
            flexDirection: 'row',
          } }
        >
          { sessionQrCode && (
            <div>
              <Image
                width={ 144 }
                height={ 144 }
                style={ { borderRadius: '12px' } }
                src={ sessionQrCode }
                alt='QR Code'
              />
            </div>
          ) }
        </div>
      </div>
    </>
  )
}


export default InvitationDetails