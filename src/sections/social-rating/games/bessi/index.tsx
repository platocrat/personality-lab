// Externals
import { FC } from 'react'
// Locals
import Overview from './overview'
// Sections
import InitiateGame from './overview/initiate-game'
// CSS
import styles from '@/sections/social-rating/games/fictional-characters/FictionalCharacters.module.css'



type BessiProps = {

}



const Bessi: FC<BessiProps> = ({
}) => {


  return (
    <>
      <div className={ styles['container'] }>
        <Overview />
        <InitiateGame />
      </div>
    </>
  )
}

export default Bessi