// Externals
import { FC } from 'react'
// Locals
import Overview from './overview'
// Sections
import InitiateGame from '@/components/SocialRating/InitiateGame'
// CSS
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



type FictionalCharactersProps = {

}



const FictionalCharacters: FC<FictionalCharactersProps> = ({
}) => {


  return (
    <>
      <div className={ styles['container'] }>
        <Overview />
      </div>
    </>
  )
}

export default FictionalCharacters