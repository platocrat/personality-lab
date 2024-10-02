// Externals
import { FC, useContext} from 'react'
import { usePathname, useRouter } from 'next/navigation'
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import Nav from '@/components/Nav'
import DropdownMenu, { NavLink } from '@/components/Nav/DropdownMenu'
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { GameSessionContext } from '@/contexts/GameSessionContext'
// Context Types
import { GameSessionContextType, SessionContextType } from '@/contexts/types'
// CSS
import styles from '@/components/Header/Header.module.css'


type HeaderProps = { }


const navTitle = `Personality Lab`



const Header: FC<HeaderProps> = ({}) => {  
  // // Auth0
  // const { user, error, isLoading } = useUser()

  // Contexts
  const {
    isGameSession
  } = useContext<GameSessionContextType>(GameSessionContext)
  const {
    email,
    isAuthenticated,
    isFetchingSession,
    setIsAuthenticated,
  } = useContext<SessionContextType>(SessionContext)
  // Hooks
  const router = useRouter()
  const pathname = usePathname()

  // Constants
  const targetPath = '/invite/'
  // const logoutHref = '/api/auth/logout'

  // Conditionals)
  const headerCondition = (
    isAuthenticated &&
    !isGameSession &&
    pathname.slice(0, targetPath.length) !== targetPath
  )

  const links: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ]


  // ----------------------------- Async functions -----------------------------
  // ~~~~~ Handle logout logic ~~~~~
  async function handleLogout(): Promise<void> {
    try {
      const response = await fetch('/api/v1/auth/logout', { 
        method: 'POST',
        body: JSON.stringify({
          email,
        })
      })

      if (response.status === 200) {
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
      { headerCondition && (
        <>
          {/* <NetworkRequestSuspense isLoading={ isLoading && !user }> */}
            {/* Header component */ }
            <header className={ styles.header }>
              <Nav title={ navTitle }>
                <DropdownMenu links={ links }>
                  <a
                    // href={ logoutHref }
                    onClick={ handleLogout }
                    className={ styles.dropdownLink }
                    style={ { borderRadius: '0rem 0rem 1rem 1rem' } }
                  >
                    { `Logout` }
                  </a>
                </DropdownMenu>
              </Nav>
            </header>
          {/* </NetworkRequestSuspense> */}
        </>
      ) }
    </>
  )
}

export default Header