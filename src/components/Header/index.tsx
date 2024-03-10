// Externals
import { FC, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// Locals
import Nav from '../Nav'
import DropdownMenu, { NavLink } from '../Nav/DropdownMenu'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import styles from '@/app/page.module.css'


type HeaderProps = { }



const Header: FC<HeaderProps> = ({}) => {  
  // Contexts
  const { setIsAuthenticated } = useContext(AuthenticatedUserContext)
  // Hooks
  const router = useRouter()
  const pathname = usePathname()

  const navTitle = `NavTitle`

  const links: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ]

  // ----------------------------- Async functions -----------------------------
  // Handle logout logic
  async function handleLogout() {
    try {
      const logoutResponse = await fetch('/api/logout', { method: 'POST' })

      if (logoutResponse.status === 200) {
        // Remove authentication from user
        setIsAuthenticated(false)
        // Refresh page to show log-in view
        pathname === '/' ? router.refresh() : router.push('/')
      } else {
        // Handle failed logout attempt (e.g., display a message)
        throw new Error('Logout failed')
      }
    } catch (error: any) {
      throw new Error('An error occurred during logout:', error)
    }
  }


  return (
    <>
      {/* Header component */ }
      <header className={ styles.header }>
        <Nav title={ navTitle }>
          <DropdownMenu links={ links }>
            <a
              onClick={ handleLogout }
              className={ styles.dropdownLink }
              style={ { borderRadius: '0rem 0rem 1rem 1rem' } }
            >
              { `Logout` }
            </a>
          </DropdownMenu>
        </Nav>
      </header>
    </>
  )
}

export default Header