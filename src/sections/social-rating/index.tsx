// Externals
import { FC, Fragment } from 'react'
// Locals
// Components
import Card from '@/components/Card'
import InitiateGame from '@/components/SocialRating/InitiateGame'
// Sections
import Bessi from './bessi'
import FictionalCharacters from './fictional-characters'
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
    description: <Bessi />,
    cssStyle,
  },
  {
    description: <FictionalCharacters />,
    cssStyle
  },
]



// --------------------------- Main Function Component -------------------------
const SocialRating: FC<SocialRatingProps> = ({

}) => {

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
            <p>
              { `Select a game from one of the options listed below to navigate to that game's page` }
            </p>
          </div>
        </div>

        {/* List of cards that present each game */ }
        <div className={ styles['list-of-games-container'] }>
          { gameCards.map((gameCard, i: number) => (
            <Fragment key={ i }>
              <Card
                description={ gameCard.description }
                cssStyle={ gameCard.cssStyle }
              />
            </Fragment>
          )) }
        </div>
        
        <div style={{ padding: '24px' }}>
          <InitiateGame />
        </div>
      </div>
    </>
  )
}

export default SocialRating