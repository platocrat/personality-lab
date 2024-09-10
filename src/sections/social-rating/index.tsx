// Externals
import { FC, Fragment } from 'react'
// Locals
import Card from '@/components/Card'
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



// ---------------------------- Function components ----------------------------
const Description: FC<DescriptionProps> = ({
  lines,
}) => {
  return (
    <>
      <div>
        <div>
          { lines.first }
        </div>
        <div style={ { marginTop: '14px' } }>
          { lines.second }
        </div>
      </div>
    </>
  )
}


// --------------------------------- Constants ---------------------------------
const hrefPrefix = `/social-rating`
const buttonText = `View Game`
const cssStyle = {
  buttonWidth: '120px',
  marginRight: 'auto',
  marginLeft: 'auto',
  position: 'relative',
}


const gameCards = [
  {
    title: `The BESSI`,
    buttonText,
    href: `${hrefPrefix}/bessi`,
    description: <Description
      lines={ {
        first: `Invite your friends to play a social rating game!`,
        second: `Using the BESSI personality assessment, see personality scores then compare and contrast to learn things about each other!`,
      } }
    />,
    cssStyle,
  },
  {
    title: `Fictional Characters`,
    buttonText,
    href: `${hrefPrefix}/fictional-characters`,
    description: <Description
      lines={{
        first: `See who between you and your friends are have the closest personality to AI-generated fictional characters!`,
        second: `This game also uses the BESSI to determine your personality scores.`,
      }}
    />,
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
              { `Welcome to the social ratings game page!` }
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
                title={ gameCard.title }
                buttonText={ gameCard.buttonText }
                href={ gameCard.href }
                description={ gameCard.description }
                cssStyle={ gameCard.cssStyle }
              />
            </Fragment>
          )) }
        </div>
      </div>
    </>
  )
}

export default SocialRating