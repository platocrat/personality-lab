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
            { `Here’s how the game works.` }
          </strong>
        </div>
        <div className={ styles['text-end'] }>
          <div className={ styles['list-item'] }>
            { `1. First, you’ll rate your SEB skills.` }
          </div>
          <div className={ styles['list-item'] }>
            { `2. Then, you’ll invite your friends if you’re the first to play (or they will have invited you).` }
          </div>
          <div className={ styles['list-item'] }>
            { `3. Then, you’ll rate each of your friends who are playing.` }
          </div>
          <div className={ styles['list-item'] }>
            { `4. We’ll match your ratings of your friend with the rating they made of themselves.` }
          </div>
          <div className={ styles['list-item'] }>
            { `5. Whoever matches their friends' ratings better on average, wins.` }
          </div>
        </div>
      </div>
    </>
  )
}


export default GameMechanics