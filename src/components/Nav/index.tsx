// Externals
import { FC } from 'react'
// Locals
import NavMenu from './NavMenu'
import NavTitle from './NavTitle'
// CSS
import styles from '@/app/page.module.css'


type NavProps = { }


const Nav: FC<NavProps> = ({ }) => {
  return (
    <>
      <nav className={ styles.nav }>
        <NavTitle />
        <NavMenu />
      </nav>
    </>
  )
}


export default Nav