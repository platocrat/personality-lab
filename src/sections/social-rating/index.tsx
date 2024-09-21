'use client'

// Externals
import {
  FC,
  useState,
  Fragment,
  useContext,
  useCallback,
  useLayoutEffect,
} from 'react'
import { usePathname } from 'next/navigation'
// Locals
// Components
import Card from '@/components/Card'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Sections
import Bessi from '@/sections/social-rating/bessi'
import InitiateGame from '@/sections/social-rating/session/initiate-game'
import InvitationDetails from '@/sections/social-rating/session/invitation-details'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Utils
import { handleEnterGameSession, SOCIAL_RATING_GAME__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/SocialRating.module.css'
import fictionalCharactersStyles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



// ----------------------------------- Types -----------------------------------
type SocialRatingProps = {

}


type DescriptionProps = {
  lines: {
    first: string
    second: string
  }
}



// --------------------------------- Constants ---------------------------------
const cssStyle = {
  formMargin: '0px',
  buttonWidth: '120px',
  marginRight: 'auto',
  marginLeft: 'auto',
  position: 'relative',
}


const gameCards = [
  {
    gameId: 'bessi',
    description: <Bessi />,
    cssStyle,
  },
  // {
  //   gameId: 'fictional-characters',
  //   description: <FictionalCharacters />,
  //   cssStyle
  // },
]

const isLobby = false



// --------------------------- Main Function Component -------------------------
const SocialRating: FC<SocialRatingProps> = ({

}) => {
  // Contexts
  const {
    email,
  } = useContext<SessionContextType>(SessionContext)
  const {
    sessionId,
    gameSessionUrlSlug,
    // Setters
    setPhase,
    setGameId,
    setHostEmail,
    setSessionId,
    setSessionPin,
    setSessionQrCode,
    setIsGameInSession,
    setGameSessionUrlSlug,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()
  // States
  const [ 
    isFetchingActiveGamesAsHost,
    setIsFetchingActiveGamesAsHost
  ] = useState<boolean>(true)
  const [ 
    selectedGame, 
    setSelectedGame
  ] = useState<number | undefined>(undefined)
  const [ isHosting, setIsHosting ] = useState<boolean>(false)
  const [ gameSessionUrl, setGameSessionUrl ] = useState<string>('')
  const [ hasActiveGame, setHasActiveGame ] = useState<boolean>(false)


  // ------------------------- Regular functions -------------------------------
  const selectedGameCss = useCallback((i: number) => {
    if (selectedGame === i) {
      return {
        boxShadow: '0px 0px 7px inset green',
        borderRadius: '1rem',
        transition: '0.15s ease-in-out'
      }
    } else {
      return null
    }
  }, [ selectedGame ])

  
  function handleSelectGame(e: any, _gameId: string, i: number): void {
    setSelectedGame(i)
    setGameId ? setGameId(_gameId) : null
  }


  // --------------------------- Async functions -------------------------------
  async function getGameSessionUrl(): Promise<void> {
    if (window !== undefined) {
      const origin_ = window.location.origin
      setGameSessionUrl(`${origin_}/${gameSessionUrlSlug}`)
    }
  }


  async function getGame(): Promise<void> {
    setIsFetchingActiveGamesAsHost(true)

    try {
      const apiEndpoint = `/api/v1/social-rating/game?hostEmail=${ email }`
      const response = await fetch(apiEndpoint, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 404) {
        const message = json.message
        
        if (message === 'hostEmail does not exist') {
          setHasActiveGame(false)
          setIsFetchingActiveGamesAsHost(false)
          return
        } else if (message === 'No social rating game entry found for hostEmail') {
          setHasActiveGame(false)
          setIsFetchingActiveGamesAsHost(false)
          return
        } else {
          throw new Error(json.error)
        }
      }

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const socialRatingGame = json.socialRatingGame as SOCIAL_RATING_GAME__DYNAMODB

      const phase_ = socialRatingGame.phase
      const gameId_ = socialRatingGame.gameId
      const isActive_ = socialRatingGame.isActive
      const hostEmail_ = socialRatingGame.hostEmail
      const sessionId_ = socialRatingGame.sessionId
      const sessionPin_ = socialRatingGame.sessionPin
      const sessionQrCode_ = socialRatingGame.sessionQrCode
      const isGameInSession_ = socialRatingGame.isGameInSession
      const gameSessionUrlSlug_ = socialRatingGame.gameSessionUrlSlug

      setPhase(phase_)
      setGameId(gameId_)
      setHostEmail(hostEmail_)
      setSessionId(sessionId_)
      setSessionPin(sessionPin_)
      setSessionQrCode(sessionQrCode_)
      setIsGameInSession(isGameInSession_)
      setGameSessionUrlSlug(gameSessionUrlSlug_)
      
      setHasActiveGame(isActive_)
      setIsFetchingActiveGamesAsHost(false)
    } catch (error: any) {
      setIsFetchingActiveGamesAsHost(false)
      throw new Error(error.message)
    }
  }


  // --------------------------- `useLayoutEffect`s ----------------------------
  useLayoutEffect(() => {
    if (email) {
      const requests = [
        getGame(),
      ]
  
      Promise.all(requests).then(() => { })
    }
  }, [ email, isHosting ])


  useLayoutEffect(() => {
    const requests = [
      getGameSessionUrl(),
    ]

    Promise.all(requests).then(() => { })
  }, [ gameSessionUrlSlug ])






  return (
    <>
      <div>
        {/* Heading */ }
        <div
          style={ {
            ...definitelyCenteredStyle,
            flexDirection: 'column',
            marginBottom: '24px',
          } }
        >
          {/* Title */ }
          <div style={ { marginBottom: '12px' } }>
            <h1>
              { `Social Rating Games` }
            </h1>
          </div>
          {/* Description */ }
          <div className={ styles['heading-description'] }>
            { !isFetchingActiveGamesAsHost && 
              !hasActiveGame && 
              !isHosting && (
              <p>
                {
                  `Select a game from one of the options listed below to navigate to that game's page`
                }
              </p>
            ) }
          </div>
        </div>

        <NetworkRequestSuspense
          isLoading={ isFetchingActiveGamesAsHost }
          spinnerOptions={{
            showSpinner: true,
            // width: '30',
            // height: '30',
            containerStyle: {
              top: '0px',
            }
          }}
        >
          {/* List of ACTIVE game sessions */}
          { hasActiveGame && (
            <div>
              {/* Allow only one ACTIVE game session per `hostEmail` */}
              <div className={ styles['container-of-divs'] }>
                <InvitationDetails isLobby={ isLobby }>
                  {/* Button to enter the ACTIVE game session */ }
                  <button
                    style={ { margin: '0px', width: '138px' } }
                    className={ fictionalCharactersStyles['generate-button'] }
                    onClick={
                      (e: any): Promise<void> => handleEnterGameSession(
                        gameSessionUrl
                      )
                    }
                  >
                    { `Enter Session` }
                  </button>
                </InvitationDetails>
              </div>
            </div>
          ) }

          { !hasActiveGame && (
            <>
              {/* List of cards that present each game */ }
              <div className={ styles['container-of-divs'] }>
                { gameCards.map((gc, i: number) => (
                  <Fragment key={ i }>
                    <div
                      className={ styles['srg-card'] }
                      onClick={ (e: any) => handleSelectGame(e, gc.gameId, i) }
                      style={{ ...selectedGameCss(i) }}
                    >
                      <Card
                        description={ gc.description }
                        cssStyle={ gc.cssStyle }
                      />
                    </div>
                  </Fragment>
                )) }
              </div>
              {/* Button for the host to initiate the game */}
              <div style={{ padding: '24px' }}>
                <InitiateGame
                  isHosting={ isHosting }
                  setIsHosting={ setIsHosting }
                />
              </div>
            </>
          ) }
        </NetworkRequestSuspense>
      </div>
    </>
  )
}

export default SocialRating