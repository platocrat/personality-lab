// Externals
import { FC} from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import Nav from '@/components/Nav'
import DropdownMenu, { NavLink } from '../Nav/DropdownMenu'
// CSS
import styles from '@/components/Header/Header.module.css'


type HeaderProps = { }


const navTitle = `Personality Lab`



const Header: FC<HeaderProps> = ({}) => {  
  // Auth0
  const { user, error, isLoading } = useUser()

  const logoutHref = '/api/auth/logout'

  const links: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ]


  return (
    <>
      { !isLoading && user ? (
        <>  
          {/* Header component */ }
          <header className={ styles.header }>
            <Nav title={ navTitle }>
              <DropdownMenu links={ links }>
                <a
                  href={ logoutHref }
                  className={ styles.dropdownLink }
                  style={ { borderRadius: '0rem 0rem 1rem 1rem' } }
                >
                  { `Logout` }
                </a>
              </DropdownMenu>
            </Nav>
          </header>
        </>
      ) : null }
    </>
  )
}

export default Header