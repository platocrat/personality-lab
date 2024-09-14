'use client'

// Externals
import { FC, Fragment, useCallback, useContext, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
import InitiateGame from '@/components/SocialRating/InitiateGame'
// Sections
import Bessi from './bessi'
import FictionalCharacters from './fictional-characters'
// Contexts
import { GameSessionContext } from '@/components/Layouts/GameSessionLayout'
// Context Types
import { GameSessionContextType } from '@/contexts/types'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/SocialRating.module.css'



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
  {
    gameId: 'fictional-characters',
    description: <FictionalCharacters />,
    cssStyle
  },
]



// --------------------------- Main Function Component -------------------------
const SocialRating: FC<SocialRatingProps> = ({

}) => {
  // Contexts
  const {
    setGameId,
  } = useContext<GameSessionContextType>(GameSessionContext)
  // States
  const [ 
    selectedGame, 
    setSelectedGame
  ] = useState<number | undefined>(undefined)
  const [ isHosting, setIsHosting ] = useState<boolean>(false)


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
            <p>
              { `Welcome to the social rating games page!` }
            </p>
            { !isHosting && (
              <p>
                {
                  `Select a game from one of the options listed below to navigate to that game's page`
                }
              </p>
            ) }
          </div>
        </div>

        {/* List of cards that present each game */ }
        <div className={ styles['list-of-games-container'] }>
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
        
        <div style={{ padding: '24px' }}>
          <InitiateGame
            isHosting={ isHosting }
            setIsHosting={ setIsHosting }
          />
        </div>
      </div>
    </>
  )
}

export default SocialRating