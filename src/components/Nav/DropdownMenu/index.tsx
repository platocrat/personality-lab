// Externals
import Link from 'next/link'
import Image from 'next/image'
import { 
  FC, 
  useRef, 
  useState,
  Fragment, 
  ReactNode, 
  useEffect,
  useContext, 
} from 'react'
// Locals
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
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
  // Contexts
  const { username } = useContext(AuthenticatedUserContext)
  // Refs
  const dropdownRef = useRef<any>(null)
  // States
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleDropdown = () => setIsVisible(!isVisible)


  useClickOutside(dropdownRef, () => setIsVisible(false))



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
                  { username }
                </p>
              </div>
              { links.map((link: NavLink, i: number) => (
                <Fragment
                  key={ i }
                >
                  <Link
                    href={ link.href }
                    className={ styles.dropdownLink }
                  >
                    { link.label }
                  </Link>
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