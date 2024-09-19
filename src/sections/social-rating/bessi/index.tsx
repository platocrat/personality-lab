// Externals
import { FC } from 'react'
// Locals
import Overview from './overview'
// Sections
import InitiateGame from '@/sections/social-rating/session/InitiateGame'
// CSS
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



type BessiProps = {

}



const Bessi: FC<BessiProps> = ({
}) => {


  return (
    <>
      <div className={ styles['container'] }>
        <Overview />
      </div>
    </>
  )
}

export default Bessi