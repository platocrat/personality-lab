// Externals
import Link from 'next/link'
import Image from 'next/image'
import { FC, Fragment, useContext, useState } from 'react'
import router, { usePathname, useRouter } from 'next/navigation'
// Locals
import { UserResponse } from '@/app/layout'
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/Nav/DropdownMenu/Dropdown.module.css'




type DropdownMenuProps = {}

type NavLink = {
  label: string
  href: string
}



const DropdownMenu: FC<DropdownMenuProps> = ({}) => {
  // Contexts
  const { setIsAuthenticated } = useContext(AuthenticatedUserContext)
  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  // Booleans
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleDropdown = () => setIsVisible(!isVisible)

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
        console.error('Logout failed')
      }
    } catch (error: any) {
      console.error(
        'An error occurred during logout:', 
        error
      )
    }
  }


  return (
    <>
      <div className={ styles.dropdown }>
        <div>
          <Image
            width={ 48 }
            height={ 48 }
            alt='Round menu icon'
            className={ styles.img }
            onClick={ toggleDropdown }
            src={ '/ic_round-menu.png' }
          />
        </div>
        { isVisible && (
          <Fragment key={ `dropdown-menu` }>
            <div className={ styles.dropdownContent }>
              { links.map((link: NavLink, i: number) => (
                <Fragment
                  key={ i }
                >
                  <Link
                    href={ link.href }
                    className={ styles.dropdownLink }
                    style={{
                      borderRadius: i === 0 ? '1rem 1rem 0rem 0rem' : ''
                    }}
                  >
                    { link.label }
                  </Link>
                </Fragment>
              )) }
              <a 
                onClick={ handleLogout } 
                className={ styles.dropdownLink }
                style={{ borderRadius: '0rem 0rem 1rem 1rem' }}
              >
                { `Logout` }
              </a>
            </div>
          </Fragment>
        ) }
      </div>
    </>
  )
}

export default DropdownMenu