// Externals
import Link from 'next/link'
import { FC, ReactNode } from 'react'
// Locals
// CSS
import styles from '@/components/Nav/Nav.module.css'



type NavProps = {
  title: string
  children: ReactNode
}



const Nav: FC<NavProps> = ({ 
  title,
  children
}) => {
  return (
    <>
      <nav className={ styles.nav }>
        <div className={ styles.navTitle }>
          <Link href='/'>
            <h1>{ title }</h1>
          </Link>
        </div>
        { children }
      </nav>
    </>
  )
}


export default Nav