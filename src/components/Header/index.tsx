// Externals
import { FC } from 'react'
// Locals
import Nav from '../Nav'
// CSS
import styles from '@/app/page.module.css'


type HeaderProps = {

}



const Header: FC<HeaderProps> = ({}) => {
  return (
    <>
      {/* Header component */ }
      <header className={ styles.header }>
        <Nav />
      </header>
    </>
  )
}

export default Header