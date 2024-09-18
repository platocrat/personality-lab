// Externals
import { 
  FC, 
  useState,
  useEffect, 
  ReactNode, 
  useContext, 
  useLayoutEffect, 
} from 'react'
import { usePathname } from 'next/navigation'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import Results from '@/components/SocialRating/GameSession/Results'
import SelfReport from '@/components/SocialRating/GameSession/SelfReport'
import ObserverReport from '@/components/SocialRating/GameSession/ObserverReport'
import InvitationDetails from '@/components/SocialRating/GameSession/InvitationDetails'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Hooks
import useStoredNickname from '@/hooks/useStoredNickname'
// Utils
import { 
  SocialRatingGamePlayer,
  INVALID_CHARS_EXCEPT_NUMBERS, 
  SOCIAL_RATING_GAME__DYNAMODB, 
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/SocialRating/GameSession/GameSession.module.css'



type GameSessionProps = {
  isLobby: boolean
  children: ReactNode
}


enum GamePhases {
  Lobby = 'lobby',
  SelfReport = 'self-report',
  ObserverReport = 'observer-report',
  Results = 'results',
}



const GameSession: FC<GameSessionProps> = ({
  isLobby,
  children,
  // sessionId,
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
  const [ phase, setPhase ] = useState<GamePhases>(GamePhases.Lobby)
  // Player states
  const [ nickname, setNickname ] = useState<string>('')
  const [ isPlayer, setIsPlayer ] = useState<boolean>(false)
  // Input states
  const [ 
    isInvalidSessionPin, 
    setIsInvalidSessionPin 
  ] = useState<boolean>(false)
  const [ sessionPinInput, setSessionPinInput ] = useState<string>('')
  const [ needsSessionPin, setNeedsSessionPin ] = useState<boolean>(true)
  // Suspense states
  const [ isFetchingGame, setIsFetchingGame ] = useState<boolean>(true)
  const [ isUpdatingPlayers, setIsUpdatingPlayers ] = useState<boolean>(false)


  // ------------------------- Regular functions -------------------------------
  // ~~~~ Input handlers ~~~~
  const onNicknameChange = (e: any): void => {
    const value = e.target.value
    setNickname(value)
  }


  const onSessionPinChange = (e: any): void => {
    const value = e.target.value
    setIsInvalidSessionPin(false)
    setSessionPinInput(e.target.value)
  }
  
  // const onSessionPinPaste = (e: any): void => {
  //   const pastedValue = e.clipboardData.getData('Text')
  //   const numericValue = pastedValue.replace(/\D/g, '') // Allow only numbers
    
  //   setIsInvalidSessionPin(false)
  //   setSessionPinInput(pastedValue) // Ensure max length of 6
   
  //   e.preventDefault() // Prevent the default paste behavior
  // }
  
  const onSessionPinKeyDown = (e: any) => {
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
  const handleNicknameSubmit = () => {
    if (nickname) {
      if (players) {
        if (nickname in players) {
          if (players[nickname]) {
            // Nickname is already taken by someone who has joined
            alert('Nickname already taken. Please choose a different nickname.')
          } else {
            // Player exists but hasn't joined yet
            setNeedsSessionPin(true)
          }
        } else {
          // The player doesn't exist we need to add them
          setNeedsSessionPin(true)
        }
      } else {
        alert('Players data not loaded yet. Please try again.')
      }
    } else {
      alert('Please enter a nickname')
    }
  }
  
  
  // --------------------------- Async functions -------------------------------
  async function getIsHost(): Promise<boolean> {
    let isHost_ = false
    if (email) isHost_ = email === hostEmail
    setIsHost(isHost_)
    return isHost_
  }

  // Handle session PIN submission
  async function handleSessionPinSubmit(): Promise<void> {
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
  async function updatePlayers() {
    try {
      const apiEndpoint = `/api/v1/social-rating/game/update-player`
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          players,
        }),
      })

      const json = await response.json()

      if (response.status === 200) {
        const players_ = json.players
        // Assuming the API returns the updated players array
        const updatedPlayers = json.players as SocialRatingGamePlayer[]
        setPlayers(updatedPlayers)
        setIsUpdatingPlayers(false)
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
    setIsFetchingGame(true)

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
      setHostEmail(hostEmail_)
      setSessionId(sessionId_)
      setSessionPin(sessionPin_)
      setSessionQrCode(sessionQrCode_)

      // Check if stored nickname is in the players list
      const storedNickname = localStorage.getItem('nickname')
      
      if (storedNickname && players_[storedNickname]) {
        setNickname(storedNickname)
        setIsPlayer(true)
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
  }, [ phase ])

  
  useLayoutEffect(() => {
    const key = 'nickname'
    const storedNickname = localStorage.getItem(key)

    if (storedNickname) {
      setNickname(storedNickname)
      setIsPlayer(true)
    }
  }, [ ])


  // ----------------------------`useLayoutEffect`s ----------------------------
  // Check if session data is available
  useLayoutEffect(() => {
    const targetIndex = '/social-rating/session/'.length
    const sessionId_ = pathname.slice(targetIndex)
    setSessionId(sessionId_)
  }, [ ])


  // Get the rest of game session details from `sessionId`
  useLayoutEffect(() => {
    if (sessionId) {
      const requests = [
        getGame(),
        getIsHost()
      ]
      
      Promise.all(requests).then(() => { })
    }
  }, [ email, sessionId ])



  
  
  return (
    <>
      <div style={{ ...definitelyCenteredStyle }}>
        { sessionId ? (
          <div>
            { isPlayer ? (
              // User is a player
              <>
                <div>
                  {/* ------------------ Game invite details -------------------- */ }
                  { phase === GamePhases.Lobby && (
                    <InvitationDetails isLobby={ isLobby } />
                  ) }

                  {/* --------------- Render other game components -------------- */ }

                  {/* --------------------- Game content ------------------------ */ }
                  
                  { children }

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
                </div>
              </>
            ) : (
              <>
                { needsSessionPin ? (
                  // Render session PIN input
                  <div className={ styles['input-section'] }>
                    <h4 className={ styles['input-label'] }>
                      { `Enter Session PIN` }
                    </h4>
                    <input
                      type={ 'text' }
                      maxLength={ 6 }
                      inputMode={ 'numeric' }
                      value={ sessionPinInput }
                      placeholder={ 'Enter 6-digit PIN ' }
                      className={ styles['input-field'] }
                      // onPaste={ (e: any): void => onSessionPinPaste(e) }
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
                      disabled={ isInvalidSessionPin }
                      className={
                        isInvalidSessionPin
                          ? styles['input-button-disabled']
                          : styles['input-button']
                      }
                      onClick={
                        (e: any): Promise<void> => handleSessionPinSubmit()
                      }
                    >
                      { `Enter Session` }
                    </button>
                  </div>
                ) : (
                  // Render nickname input
                  <div className={ styles['input-section'] }>
                    <h4 className={ styles['input-label'] }>
                      { `Enter Nickname` }
                    </h4>
                    <input
                      type='text'
                      value={ nickname }
                      className={ styles['input-field'] }
                      onChange={ (e: any) => onNicknameChange(e) }
                    />
                    <button
                      onClick={ handleNicknameSubmit }
                      className={ styles['input-button'] }
                    >
                      { `Join` }
                    </button>
                  </div>
                ) }
              </>
            ) }
          </div>
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
      </div>
    </>
  )
}


export default GameSession