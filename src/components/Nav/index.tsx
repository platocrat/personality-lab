// Externals
import { FC, ReactNode } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
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
          <ProgressBarLink href='/'>
            <h1>{ title }</h1>
          </ProgressBarLink>
        </div>
        { children }
      </nav>
    </>
  )
}


export default Nav