'use client'

// Externals
import {
  FC,
  useRef,
  useState,
  Fragment,
  ReactNode,
  useEffect,
  useContext,
  } from 'react'
  import Image from 'next/image'
  // import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
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
  // // Auth0 
  // const { user, error, isLoading } = useUser()

  // Contexts
  const { email } = useContext<SessionContextType>(SessionContext)

  // Refs
  const dropdownRef = useRef<any>(null)
  const notificationRef = useRef(null)
  // States
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleDropdown = () => {
    setIsVisible(!isVisible)
  }

  useClickOutside(dropdownRef, () => setIsVisible(false))



  return (
    <>
      <div className={ styles.dropdown } ref={ dropdownRef }>
        <div>
          {/* { isLoading && user ? ( */}
          { email ? (
            <>
              <Image
                width={ 48 }
                height={ 48 }
                alt='Round menu icon to open the navbar menu'
                className={ styles.img }
                onClick={ toggleDropdown }
                src={
                  isVisible
                    ? `${imgPaths().png}ph_x-bold.png`
                    : `${imgPaths().png}ic_round-menu.png`
                }
              />
            </>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  height: '54px',
                  width: '54px'
                }}
              >
                <img
                  alt='Profile'
                  width={ 44 }
                  height={ 44 }
                  className={ styles.img }
                  style={ {
                    position: 'relative',
                    top: '3px',
                    right: '-7px',
                    boxShadow: isVisible
                      ? '0px 3px 5px 1.5px rgba(0, 75, 118, 0.5)'
                      : ''
                  } }
                  onClick={ toggleDropdown }
                  // src={ user && (user.picture ?? '') }
                  src={ email ? '' : undefined }
                />
              </div>
            </>
          )}
        </div>


        { isVisible && (
          <Fragment key={ `dropdown-menu` }>
            <div className={ `${styles.dropdownContent} ${isVisible ? 'slideIn' : 'slideOut'}` }>
              { links.map((link: NavLink, i: number) => (
                <Fragment
                  key={ i }
                >
                  <ProgressBarLink
                    href={ link.href }
                    className={ styles.dropdownLink }
                  >
                    { i === 0 
                      ? (
                        <>
                        <div 
                          className={ styles.username }
                          style={{ display: 'flex', gap: '14px' }}
                        >
                          <div style={ definitelyCenteredStyle }>
                            <p>
                              {/* { user?.name } */}
                              { email }
                            </p>
                          </div>
                          <div 
                            style={{ 
                              ...definitelyCenteredStyle,
                              textAlign: 'center',
                              fontSize: 'clamp(6px, 2vw, 10px)',
                            }}
                          >
                            <p>
                              { `View Profile` }
                            </p>
                          </div>
                        </div>
                        </>
                      ) 
                      : link.label 
                    }
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