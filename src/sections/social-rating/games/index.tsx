// Externals
import { FC } from 'react'
// Locals
import Card from '@/components/Card'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/games/Games.module.css'



type GamesProps = {

}


type DescriptionProps = {
  lines: {
    first: string
    second: string
  }
}



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




const Games: FC<GamesProps> = ({

}) => {

  return (
    <>
      <div>
        {/* Heading */}
        <div
          style={ {
            ...definitelyCenteredStyle,
            flexDirection: 'column',
            marginBottom: '24px',
          } }
        >
          {/* Title */}
          <div style={{ marginBottom: '12px' }}>
            <h1>
              { `Social Rating Games` }  
            </h1>
          </div>
          {/* Description */}
          <div className={ styles['heading-description'] }>
            <p>
              { `Welcome to the social ratings game page!` }
            </p>
            <p>
              { `Select a game from one of the options listed below to navigate to that game's page` }
            </p>
          </div>
        </div>

        {/* List of cards that present each game */}
        <div className={ styles['list-of-games-container'] }>
          <Card
            title={ `The BESSI` }
            buttonText={ 'View Game' }
            href={ '/social-rating/games/bessi' }
            description={ 
              <Description 
                lines={{
                  first: `Invite your friends to play a social rating game!`,
                  second: `Using the BESSI personality assessment, see personality scores then compare and contrast to learn things about each other!`,
                }}
              />
            }
            cssStyle={ {
              buttonWidth: '120px',
              marginRight: 'auto',
              marginLeft: 'auto',
              position: 'relative',
            } }
          />
          <Card
            title={ `Fictional Characters` }
            buttonText={ 'View Game' }
            href={ '/social-rating/games/fictional-characters' }
            description={ (
              <Description 
                lines={{
                  first: `See who between you and your friends are have the closest personality to AI-generated fictional characters!`,
                  second: `This game also uses the BESSI to determine your personality scores.`,
                }}
              />
            ) }
            cssStyle={ {
              buttonWidth: '120px',
              marginRight: 'auto',
              marginLeft: 'auto',
              position: 'relative',
            } }
          />
        </div>
      </div>
    </>
  )
}


export default Games
