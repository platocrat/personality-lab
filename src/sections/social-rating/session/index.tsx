'use client'

// Externals
import { usePathname } from 'next/navigation'
import {
  FC,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import Title from '@/sections/social-rating/session/title'
import InGame from '@/sections/social-rating/session/in-game'
import SessionLobby from '@/sections/social-rating/session/lobby'
import NicknameForm from '@/sections/social-rating/session/forms/nickname'
import SessionPinForm from '@/sections/social-rating/session/forms/session-pin'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// Utils
import {
  Player,
  GamePhases,
  SocialRatingGamePlayers,
  INVALID_CHARS_EXCEPT_NUMBERS,
  SOCIAL_RATING_GAME__DYNAMODB,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type SocialRatingSessionProps = {

}




const SocialRatingSession: FC<SocialRatingSessionProps> = ({

}) => {
  // Contexts
  const {
    email,
  } = useContext<SessionContextType>(SessionContext)
  const {
    phase,
    gameId,
    isHost,
    players,
    hostEmail,
    sessionId,
    sessionPin,
    sessionQrCode,
    // Setters
    setPhase,
    setGameId,
    setIsHost,
    setPlayers,
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
  // Player states
  const [nickname, setNickname] = useState<string>('')
  const [isPlayer, setIsPlayer] = useState<boolean>(false)
  const [userIP, setUserIP] = useState<string | null>(null)
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
  ] = useState<string>('')
  const [sessionPinInput, setSessionPinInput] = useState<string>('')
  const [needsSessionPin, setNeedsSessionPin] = useState<boolean>(true)
  // Suspense states
  const [
    isFetchingIpAddress, 
    setIsFetchingIpAddress
  ] = useState<boolean>(true)
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
    const numericValueSliced = numericValue.slice(0, 6) // Ensure max length of 6

    e.preventDefault() // Prevent the default paste behavior
    setIsInvalidSessionPin(false)
    setSessionPinInput(numericValueSliced)
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


  const onStartGame = () => {
    setIsGameInSession(true)
    setPhase(GamePhases.ConsentForm) // Move to ConsentForm phase
  }


  // ~~~~ Functions to handle each phase ~~~~
  const computeResults = () => {
    // Compute profile correlations
    // Determine the winner
  }


  // --------------------------- Async functions -------------------------------
  // ~~~~~ Handle nickname submission ~~~~~
  async function handleNicknameSubmit(e: any) {
    e.preventDefault()
    
    if (nickname) {
      const isPlayer_ = true

      const isDuplicateNickname_ = await updatePlayers(nickname) as boolean

      if (isDuplicateNickname_ === false) {
        // After successful update, store the data in localStorage
        const key = 'nickname'
        const value = nickname
        localStorage.setItem(key, value)
        
        const player = players[nickname]
        
        if (player) {
          const key = 'player'
          const value = JSON.stringify(player)
          localStorage.setItem(key, value)
        }
 
        setIsPlayer(isPlayer_)
      }
    }
  }


  // ~~~~~ Checks if the user is a player ~~~~~
  async function getIsPlayer(): Promise<void> {
    if (userIP) {
      // Check if stored nickname is in the players list
      const storedNickname = localStorage.getItem('nickname')
      const storedPlayer = localStorage.getItem('player')

      if (storedNickname && storedPlayer && players[storedNickname]) {
        const player = JSON.parse(storedPlayer) as Player

        if (player.ipAddress === userIP) {
          setNickname(storedNickname)
          setIsPlayer(true)
        }
      } else if (players) {
        await getIsHost() // Check if the player is the game's host

        // If no data in localStorage, check if IP matches any player
        const matchingEntry = Object.entries(players).find(
          ([ nickname, player ]): boolean => player.ipAddress === userIP
        )

        if (matchingEntry) {
          const [matchedNickname, matchedPlayer] = matchingEntry
          setNickname(matchedNickname)
          setIsPlayer(true)
          
          // Store in localStorage
          localStorage.setItem('nickname', matchedNickname)
          localStorage.setItem('player', JSON.stringify(matchedPlayer))
        }
      }
    }
  }


  // ~~~~~ Check if the player is the game's host ~~~~~
  async function getIsHost(): Promise<void> {
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


  // ~~~~~ Handle session PIN submission ~~~~~
  async function handleSessionPinSubmit(e: any): Promise<void> {
    e.preventDefault()

    if (sessionPinInput.length !== 6) {
      setIsInvalidSessionPin(true)
      return
    } else if (sessionPinInput === sessionPin) {
      setNeedsSessionPin(false)
    } else {
      setIsInvalidSessionPin(true)
    }
  }


  async function getUserIP(): Promise<void> {
    try {
      const apiEndpoint = `/api/v1/social-rating/game/ip-address`
      const response = await fetch(apiEndpoint, { method: 'GET' })
      
      const json = await response.json()

      if (response.status === 405) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      const ipAddress = json.ipAddress
      
      setUserIP(ipAddress)      
      setIsFetchingIpAddress(false)
    } catch (error: any) {
      setIsFetchingIpAddress(false)
      
      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error getting user's IP address`, error.message)
    }
  }


  // Add or update player in the game
  async function updatePlayers(_nickname: string): Promise<boolean> {
    setIsUpdatingPlayers(true)

    let isDuplicateNickname_ = false

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
      
      if (response.status === 500) {
        setIsUpdatingPlayers(false)
        throw new Error(json.error)
      }
      
      if (response.status === 405) {
        setIsUpdatingPlayers(false)
        throw new Error(json.error)
      }
      
      if (response.status === 200) {
        const message = json.message
        const targetMessage = 'Nickname is taken! Please choose a different nickname.'

        if (message === targetMessage) {
          const message = json.message

          setIsPlayer(false)
          setDuplicateNicknameErrorMessage(message)
          setIsDuplicateNickname(true)
          setIsUpdatingPlayers(false)

          isDuplicateNickname_ = true
          return isDuplicateNickname_
        } else {
          const updatedPlayers = json.updatedPlayers as SocialRatingGamePlayers
          setPlayers(updatedPlayers)
          setIsUpdatingPlayers(false)

          isDuplicateNickname_ = false
          return isDuplicateNickname_
        }
      } else {
        setIsUpdatingPlayers(false)

        const error = `Error posting new players to social rating game with session ID '${
          sessionId
        }' to DynamoDB: `

        throw new Error(`${error}: ${json.error}`)
      }
    } catch (error: any) {
      console.log(error)
      setIsUpdatingPlayers(false)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error updating player: `, error.message)
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

      if (response.status === 200) {
        const socialRatingGame = json.socialRatingGame as SOCIAL_RATING_GAME__DYNAMODB

        const gameId_ = socialRatingGame.gameId
        const players_ = socialRatingGame.players
        const hostEmail_ = socialRatingGame.hostEmail
        const sessionId_ = socialRatingGame.sessionId
        const sessionPin_ = socialRatingGame.sessionPin
        const sessionQrCode_ = socialRatingGame.sessionQrCode
        const gameSessionUrlSlug_ = socialRatingGame.gameSessionUrlSlug

        setGameId(gameId_)
        setPlayers(players_)
        setHostEmail(hostEmail_)
        setSessionId(sessionId_)
        setSessionPin(sessionPin_)
        setSessionQrCode(sessionQrCode_)
        setGameSessionUrlSlug(gameSessionUrlSlug_)

        setIsFetchingGame(false)
      }
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


  // ----------------------------`useLayoutEffect`s ----------------------------
  // ~~~~~ Check if session data is available ~~~~~
  useLayoutEffect(() => {
    const targetIndex = '/social-rating/session/'.length
    const sessionId_ = pathname.slice(targetIndex)
    setSessionId(sessionId_)
  }, [ ])


  // ~~~~~ Check if the URL contains the 'from=qr' query parameter ~~~~~
  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const isFromQR = searchParams.get('from') === 'qr'

    if (isFromQR) {
      // Mark that the user joined via QR code
      console.log('User joined via QR code')
      // Show the nickname input prompt
      setNeedsSessionPin(false)
    }
  }, [ ])


  // ~~~~~ Get the user's IP ~~~~~~
  useLayoutEffect(() => {
    const requests = [ 
      getUserIP(),
    ]

    Promise.all(requests).then(() => { })
  }, [ ])


  // ~~~~~ Check if the user is a player ~~~~~
  useLayoutEffect(() => {
    if (!isDuplicateNickname) {
      if (players && userIP) {
        const requests = [
          getIsPlayer(),
        ]
  
        Promise.all(requests).then(() => { })
      }
    }
  }, [ players, userIP, isDuplicateNickname ])


  // ~~~~~ Get the rest of game session details from `sessionId` ~~~~~
  useLayoutEffect(() => {
    localStorage.clear()
    if (sessionId) {
      const requests = [
        getGame(),
      ]

      Promise.all(requests).then(() => { })
    }
  }, [ email, sessionId ])





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
                        <SessionLobby onClick={ onStartGame } />
                      </>
                    ) : (
                      <>
                        {/* --------------- Render other game components -------------- */ }

                        {/* ------------------- In-game content ------------------- */ }

                        <InGame />
                      </>
                    ) }
                  </div>
                </>
              ) : (
                <>
                  {/* Render session PIN input */}
                  { needsSessionPin ? (
                    <SessionPinForm 
                      onSubmit={ handleSessionPinSubmit }
                      state={{
                        sessionPinInput,
                        isInvalidSessionPin,
                      }}
                      inputHandlers={{
                        onSessionPinPaste,
                        onSessionPinChange,
                        onSessionPinKeyDown,
                      }}
                    />
                  ) : (
                    <>
                      <NicknameForm 
                        onChange={ onNicknameChange }
                        onSubmit={ handleNicknameSubmit }
                        state={{
                          nickname,
                          isUpdatingPlayers,
                          isDuplicateNickname,
                          duplicateNicknameErrorMessage,
                        }}
                      />
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