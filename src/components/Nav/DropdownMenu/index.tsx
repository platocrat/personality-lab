// Externals
import { 
  FC, 
  useRef, 
  useState,
  Fragment, 
  ReactNode, 
  useEffect,
  } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { imgPaths } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/Nav/DropdownMenu/Dropdown.module.css'



type DropdownMenuProps = {
  links: NavLink[]
  children: ReactNode
}

export type NavLink = {
  label: string
  href: string
}




const DropdownMenu: FC<DropdownMenuProps> = ({
  links,
  children
}) => {
  // Auth0 
  const { user, error, isLoading } = useUser()
  // Refs
  const dropdownRef = useRef<any>(null)
  // States
  const [isVisible, setIsVisible] = useState<boolean>(false)


  const toggleDropdown = () => setIsVisible(!isVisible)

  useClickOutside(dropdownRef, () => setIsVisible(false))


  useEffect(() => {
    console.log(
      `[${new Date().toLocaleString()} --filepath="src/components/Nav/DropdownMenu/index.tsx" --function="useEffect()"]: user: `, 
      user
    )
  }, [ user ])




  return (
    <>
      <div className={ styles.dropdown } ref={ dropdownRef }>
        <div>
          <Image
            width={ 48 }
            height={ 48 }
            alt='Round menu icon to open the navbar menu'
            className={ styles.img }
            onClick={ toggleDropdown }
            src={ 
              isVisible 
                ? `${ imgPaths().png }ph_x-bold.png` 
                : `${ imgPaths().png }ic_round-menu.png`
            }
          />
        </div>
        { isVisible && (
          <Fragment key={ `dropdown-menu` }>
            <div className={ styles.dropdownContent }>
              <div 
                className={ `${styles.username}` }
                style={{
                  cursor: 'default',
                  borderRadius: '1rem 1rem 0rem 0rem',
                }}
              >
                <p style={ definitelyCenteredStyle }>
                  { user?.name }
                </p>
              </div>
              { links.map((link: NavLink, i: number) => (
                <Fragment
                  key={ i }
                >
                  <ProgressBarLink
                    href={ link.href }
                    className={ styles.dropdownLink }
                  >
                    { link.label }
                  </ProgressBarLink>
                </Fragment>
              )) }
              { children }
            </div>
          </Fragment>
        ) }
      </div>
    </>
  )
}

export default DropdownMenu