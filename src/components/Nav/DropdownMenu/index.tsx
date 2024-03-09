// Externals
import Link from 'next/link'
import Image from 'next/image'
import { FC, useState } from 'react'
import router, { useRouter } from 'next/navigation'
// Locals
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/Nav/DropdownMenu/Dropdown.module.css'




type DropdownMenuProps = {}

type NavLink = {
  label: string
  href: string
}



const DropdownMenu: FC<DropdownMenuProps> = ({}) => {
  const router = useRouter()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleDropdown = () => setIsVisible(!isVisible)

  const links: NavLink[] = [
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
  ]


  // Handle logout logic
  async function handleLogout() {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      
      if (response.ok) {
        // Assuming the API route redirects or you manually handle redirection
        router.push('/')
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
          <>
            <div className={ styles.dropdownContent }>
              { links.map((link: NavLink, i: number) => (
                <>
                  <Link
                    key={ i }
                    href={ link.href }
                    className={ styles.dropdownLink }
                  >
                    { link.label }
                  </Link>
                </>
              )) }
              <a 
                onClick={ handleLogout } 
                className={ styles.dropdownLink }
              >
                { `Logout` }
              </a>
            </div>
          </>
        ) }
      </div>
    </>
  )
}

export default DropdownMenu