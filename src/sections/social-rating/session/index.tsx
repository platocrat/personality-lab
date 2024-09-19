'use client'

// Externals
import {
  FC,
  useState,
  Fragment,
  ReactNode,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react'
import { usePathname } from 'next/navigation'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import Title from '@/sections/social-rating/session/title'
import Results from '@/sections/social-rating/session/results'
import SelfReport from '@/sections/social-rating/session/self-report'
import ObserverReport from '@/sections/social-rating/session/observer-report'
import InvitationDetails from '@/sections/social-rating/session/invitation-details'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Hooks
import useStoredNickname from '@/hooks/useStoredNickname'
// Utils
import {
  SocialRatingGamePlayers,
  INVALID_CHARS_EXCEPT_NUMBERS,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css'



type SocialRatingSessionProps = {

}


enum GamePhases {
  Lobby = 'lobby',
  SelfReport = 'self-report',
  ObserverReport = 'observer-report',
  Results = 'results',
}



const SocialRatingSession: FC<SocialRatingSessionProps> = ({

}) => {
  // Contexts
  const {
    email,
  } = useContext<SessionContextType>(SessionContext)
  const {
    gameId,
    isHost,
    players,
    hostEmail,
    sessionId,
    sessionPin,
    sessionQrCode,
    // Setters
    setGameId,
    setIsHost,
    setPlayers,
    setHostEmail,
    setSessionId,
    setSessionPin,
    setSessionQrCode,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // Hooks
  const pathname = usePathname()
  const storedNickname = useStoredNickname()
  // States
  // State to manage game phases
  const [phase, setPhase] = useState<GamePhases>(GamePhases.Lobby)
  // Player states
  const [nickname, setNickname] = useState<string>('')
  const [isPlayer, setIsPlayer] = useState<boolean>(false)
  // Input states
  const [
    isInvalidSessionPin,
    setIsInvalidSessionPin
  ] = useState<boolean>(false)
  const [ 
    isDuplicateNickname, 
    setIsDuplicateNickname
  ] = useState<boolean>(false)
  const [ 
    duplicateNicknameErrorMessage,
    setDuplicateNicknameErrorMessage
  ] = useState<boolean>(false)
  const [sessionPinInput, setSessionPinInput] = useState<string>('')
  const [needsSessionPin, setNeedsSessionPin] = useState<boolean>(true)
  // Suspense states
  const [isFetchingGame, setIsFetchingGame] = useState<boolean>(true)
  const [isUpdatingPlayers, setIsUpdatingPlayers] = useState<boolean>(false)


  // ------------------------- Regular functions -------------------------------
  // ~~~~ Input handlers ~~~~
  const onNicknameChange = (e: any): void => {
    const value = e.target.value
    // Regular expression to allow only alphanumeric characters, underscores, 
    // and hyphens
    const sanitizedValue = value.replace(/[^a-zA-Z0-9-_]/g, '')
    // Optionally limit the length of the nickname (e.g., max 12 characters)
    const maxLength = 12
    const secureNickname = sanitizedValue.slice(0, maxLength)

    setNickname(secureNickname)
    // Reset the duplicate flag when nickname changes
    setIsDuplicateNickname(false)
  }


  const onSessionPinChange = (e: any): void => {
    const value = e.target.value
    setIsInvalidSessionPin(false)
    setSessionPinInput(e.target.value)
  }


  const onSessionPinPaste = (e: any): void => {
    const pastedValue = e.clipboardData.getData('Text')
    const numericValue = pastedValue.replace(/\D/g, '') // Allow only numbers

    e.preventDefault() // Prevent the default paste behavior
    setIsInvalidSessionPin(false)
    setSessionPinInput(numericValue) // Ensure max length of 6
  }


  const onSessionPinKeyDown = (e: any) => {
    // Allow CMD + V (macOS) or CTRL + V (Windows/Linux) to paste
    if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      return // Allow pasting
    }

    if (INVALID_CHARS_EXCEPT_NUMBERS.includes(e.key)) {
      e.preventDefault()
    } else {
      setIsInvalidSessionPin(false)
    }
  }


  // ~~~~ Functions to handle each phase ~~~~
  const handleSelfReportCompletion = () => {
    // Collect self-report data
    // Move to observer-report phase
    setPhase(GamePhases.SelfReport)
  }


  const handleObserverReportCompletion = () => {
    // Collect observer-report data
    // Move to results phase
    setPhase(GamePhases.Results)
  }


  const computeResults = () => {
    // Compute profile correlations
    // Determine the winner
  }


  // Handle nickname submission
  async function handleNicknameSubmit(e: any) {
    e.preventDefault()

    if (nickname) {
      const key = 'nickname'
      const value = nickname
      localStorage.setItem(key, value) // Cache nickname in local storage

      await updatePlayers(nickname)
    }
  }


  // --------------------------- Async functions -------------------------------
  async function getIsHost() {
    let isHost_ = false,
      isPlayer_ = false
    
    if (email) {
      const hostHasJoined = players ? players['host'] : false

      if (email === hostEmail && hostHasJoined) {
        isHost_ = true
        isPlayer_ = true
      }
    }
    
    setIsHost(isHost_)
    setIsPlayer(isPlayer_)
  }

  // Handle session PIN submission
  async function handleSessionPinSubmit(e: any): Promise<void> {
    e.preventDefault()

    if (sessionPinInput.length !== 6) {
      setIsInvalidSessionPin(true)
      return
    } else if (sessionPinInput === sessionPin) {
      // await updatePlayers()
      // setHasJoined(true)
      setNeedsSessionPin(false)
    } else {
      setIsInvalidSessionPin(true)
    }
  }

  // Add or update player in the game
  async function updatePlayers(_nickname: string): Promise<void> {
    const hasJoined = true
    const ipAddress = ''
    const joinedAtTimestamp = 0

    const player = {
      hasJoined,
      ipAddress,
      joinedAtTimestamp,
    } 

    const _players: SocialRatingGamePlayers = { [ _nickname ]: player }

    try {
      const apiEndpoint = `/api/v1/social-rating/game/update-players`
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          players: _players,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const updatedPlayers = json.updatedPlayers as SocialRatingGamePlayers
        setPlayers(updatedPlayers)
        setIsUpdatingPlayers(false)
      } else if (response.status === 400) {
        const message = json.message
        setDuplicateNicknameErrorMessage(message)
        setIsDuplicateNickname(true)
      } else if (response.status === 500) {
        throw new Error(json.error)
      } else if (response.status === 405) {
        throw new Error(json.error)
      } else {
        setIsUpdatingPlayers(false)

        const error = `Error posting new players to social rating game with session ID '${
          sessionId
        }' to DynamoDB: `

        throw new Error(json.error)
      }
    } catch (error: any) {
      setIsUpdatingPlayers(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error updating player`, error.message)
    }
  }


  async function getGame(): Promise<void> {
    try {
      const apiEndpoint = `/api/v1/social-rating/game?sessionId=${sessionId}`
      const response = await fetch(apiEndpoint, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 404) {
        const message = json.message

        if (message === 'sessionId does not exist') {
          // setHasActiveGame(false)
          setIsFetchingGame(false)
          return
        } else if (message === 'No social rating game entry found for sessionId') {
          // setHasActiveGame(false)
          setIsFetchingGame(false)
          return
        } else {
          throw new Error(json.error)
        }
      }

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      const socialRatingGame = json.socialRatingGame as SOCIAL_RATING_GAME__DYNAMODB

      const gameId_ = socialRatingGame.gameId
      const players_ = socialRatingGame.players
      const hostEmail_ = socialRatingGame.hostEmail
      const sessionId_ = socialRatingGame.sessionId
      const sessionPin_ = socialRatingGame.sessionPin
      const sessionQrCode_ = socialRatingGame.sessionQrCode

      // const pagePath = `${origin}${pathname}/session`
      // const gameSessionUrl_ = `${pagePath}/${sessionId_}`
      // setGameSessionUrl(gameSessionUrl_)

      // const isActive_ = socialRatingGame.isActive
      // setHasActiveGame(isActive_)

      setGameId(gameId_)
      setPlayers(players_)
      setHostEmail(hostEmail_)
      setSessionId(sessionId_)
      setSessionPin(sessionPin_)
      setSessionQrCode(sessionQrCode_)

      // Check if stored nickname is in the players list
      const storedNickname = localStorage.getItem('nickname')

      if (storedNickname && players_[storedNickname]) {
        setNickname(storedNickname)
        setIsPlayer(true)
      } else {
        await getIsHost()
      }

      setIsFetchingGame(false)
    } catch (error: any) {
      setIsFetchingGame(false)
      throw new Error(error.message)
    }
  }


  // ---------------------------- `useEffect`s ---------------------------------
  useEffect(() => {
    if (phase === GamePhases.Results) {
      computeResults()
    }
  }, [phase])


  // ----------------------------`useLayoutEffect`s ----------------------------
  // ~~~~~ Check if nickname is in players list ~~~~~
  useLayoutEffect(() => {
    let isPlayer_ = false

    if (isHost) {
      isPlayer_ = true
    } else {
      if (storedNickname.isPlayer) {
        isPlayer_ = true
      } else {
        if (players && storedNickname.nickname) {
          isPlayer_ = players[storedNickname.nickname].hasJoined
        } else {
          isPlayer_ = false
        }
      }
    }

    setIsPlayer(isPlayer_)
  }, [isHost, storedNickname, players])


  // ~~~~~ Check if session data is available ~~~~~
  useLayoutEffect(() => {
    const targetIndex = '/social-rating/session/'.length
    const sessionId_ = pathname.slice(targetIndex)
    setSessionId(sessionId_)
  }, [ ])


  // ~~~~~ Get the rest of game session details from `sessionId` ~~~~~
  useLayoutEffect(() => {
    if (sessionId) {
      const requests = [
        getGame(),
      ]

      Promise.all(requests).then(() => { })
    }
  }, [email, sessionId])





  return (
    <>
      { !isFetchingGame && sessionId && gameId ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              flexDirection: 'column',
            } }
          >
            <Title />
            <div>
              { isPlayer ? (
                <>
                  { /* User is a player */ }
                  <div>
                    {/* ------------------ Game lobby -------------------- */ }
                    { phase === GamePhases.Lobby ? (
                      <>
                        <InvitationDetails
                          isLobby={ phase === GamePhases.Lobby } 
                        />

                        <div
                          style={ { 
                            ...definitelyCenteredStyle,
                            margin: '48px', 
                            flexDirection: 'row',
                          } }
                        >
                          { players && Object.keys(players).length > 0 ? (
                            <>
                              { Object.keys(players).map((
                                _nickname: string,
                                i: number
                              ) => (
                                <Fragment key={ i }>
                                  <h3
                                    key={ _nickname }
                                    className={ styles['player-nickname'] }
                                  >
                                    { _nickname }
                                  </h3>
                                </Fragment>
                              )) }
                            </>
                          ) : (
                            <h2>
                              { `Waiting for other players...` }
                            </h2>
                          ) }
                        </div>
                      </>
                    ) : (
                      <>
                        {/* --------------- Render other game components -------------- */ }

                        {/* ------------------- In-game content ------------------- */ }

                        <div>
                          { phase === GamePhases.SelfReport && (
                            <SelfReport
                              onCompletion={ handleSelfReportCompletion }
                            />
                          ) }

                          { phase === GamePhases.ObserverReport && (
                            <ObserverReport
                              onCompletion={ handleObserverReportCompletion }
                            />
                          ) }

                          { phase === GamePhases.Results && <Results /> }
                        </div>
                      </>
                    ) }
                  </div>
                </>
              ) : (
                <>
                  {/* Render session PIN input */}
                  { needsSessionPin ? (
                    <form 
                      className={ styles['input-section'] }
                      onSubmit={
                        (e: any): Promise<void> => handleSessionPinSubmit(e)
                      }
                    >
                      <h4 className={ styles['input-label'] }>
                        { `Enter Session PIN` }
                      </h4>
                      <input
                        type={ 'text' }
                        maxLength={ 6 }
                        inputMode={ 'numeric' }
                        value={ sessionPinInput }
                        placeholder={ 'Enter 6-digit PIN' }
                        className={ styles['input-field'] }
                        onPaste={ (e: any): void => onSessionPinPaste(e) }
                        onChange={ (e: any): void => onSessionPinChange(e) }
                        onKeyDown={ (e: any): any => onSessionPinKeyDown(e) }
                        style={ {
                          borderColor: isInvalidSessionPin
                            ? 'rgb(243, 0, 0)'
                            : '',
                          boxShadow: isInvalidSessionPin
                            ? '0 2px 6px 3px rgb(243, 0, 0, 0.15)'
                            : ''
                        } }
                      />
                      <button
                        type={ 'submit' }
                        disabled={ isInvalidSessionPin }
                        className={
                          isInvalidSessionPin
                            ? styles['input-button-disabled']
                            : styles['input-button']
                        }
                      >
                        { `Enter Session` }
                      </button>
                    </form>
                  ) : (
                    <>
                      { /* Render nickname input */ }
                      <form 
                        className={ styles['input-section'] }
                        onSubmit={
                          (e: any): Promise<void> => handleNicknameSubmit(e) 
                        }
                      >
                        <h4 className={ styles['input-label'] }>
                          { `Enter Nickname` }
                        </h4>
                        <input
                          type='text'
                          value={ nickname }
                          placeholder={ 'Enter a Nickname' }
                          className={ styles['input-field'] }
                          onChange={ (e: any) => onNicknameChange(e) }
                        />
                        <button
                          type={ 'submit' }
                          className={ styles['input-button'] }
                        >
                          { `Join` }
                        </button>
                      </form>
                    </>
                  ) }
                </>
              ) }
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Suspense */ }
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              // top: '80px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) }
    </>
  )
}


export default SocialRatingSession