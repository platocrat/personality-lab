// Externals
import { FC, useState } from 'react'
// Locals
import NavTitle from './NavTitle'
import DropdownMenu from './DropdownMenu'
// CSS
import styles from '@/components/Nav/Nav.module.css'



type NavProps = { }




const Nav: FC<NavProps> = ({ }) => {
  return (
    <>
      <nav className={ styles.nav }>
        <NavTitle />
        {/* <Logout /> */}
        <DropdownMenu />
      </nav>
    </>
  )
}


export default Nav