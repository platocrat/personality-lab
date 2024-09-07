// Externals
import { FC} from 'react'
import { usePathname } from 'next/navigation'
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import Nav from '@/components/Nav'
import DropdownMenu, { NavLink } from '@/components/Nav/DropdownMenu'
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// CSS
import styles from '@/components/Header/Header.module.css'


type HeaderProps = { }


const navTitle = `Personality Lab`



const Header: FC<HeaderProps> = ({}) => {  
  // // Auth0
  // const { user, error, isLoading } = useUser()
  // Hooks
  const pathname = usePathname()

  // Constants
  const logoutHref = '/api/v1/auth/logout'
  const targetPath = '/invite/'
  // Conditionals
  const headerCondition = pathname.slice(0, targetPath.length) !== targetPath

  const links: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ]


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
                    href={ logoutHref }
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