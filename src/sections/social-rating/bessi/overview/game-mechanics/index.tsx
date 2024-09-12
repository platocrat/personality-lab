// Externals
import { FC } from 'react'
// Locals
// CSS
import styles from '@/sections/social-rating/SocialRating.module.css'



type GameMechanicsProps = {

}




const GameMechanics: FC<GameMechanicsProps> = ({

}) => {
  return (
    <>
      <div
        className={ styles.container }
        style={ {
          margin: '0px',
          textAlign: 'left',
        } }
      >
        <div>
          <strong>
            { `How does this game work?` }
          </strong>
        </div>
        <div className={ styles['text'] }>
          <div className={ styles['list-item'] }>
            { `1. Each player completes their own BESSI-20, a shortened 20-question version of the original 192-question BESSI.` }
          </div>
          <div className={ styles['list-item'] }>
            { `2. After completing the BESSI-20, each player rates all the other players on the BESSI-20.` }
          </div>
          <div className={ styles['list-item'] }>
            { 
              `3. Profile correlations are done between each player's self-rating and each rating done by every other player (round robin style).`
            }
          </div>
          <div className={ styles['list-item'] }>
            { 
              `4. The average of all profile correlations is taken for each player.`
            }
          </div>
          <div className={ styles['list-item'] }>
            { 
              `5. A rank is given for each player's average profile correlation and whoever has the highest rank wins!`
            }
          </div>
        </div>
      </div>
    </>
  )
}


export default GameMechanics