// Externals
import { FC } from 'react'
// Locals
import SocialRatingInstructions from './instructions'
// Sections
import InitiateGame from './instructions/initiate-game'
// CSS
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



type FictionalCharactersProps = {

}



const FictionalCharacters: FC<FictionalCharactersProps> = ({
}) => {


  return (
    <>
      <div className={ styles['container'] }>
        <SocialRatingInstructions />
        <InitiateGame />
      </div>
    </>
  )
}

export default FictionalCharacters