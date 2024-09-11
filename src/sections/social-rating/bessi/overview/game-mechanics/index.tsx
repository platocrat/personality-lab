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
        <div className={ styles.text }>
          { `` }
        </div>
      </div>
    </>
  )
}


export default GameMechanics