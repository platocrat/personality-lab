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
  useLayoutEffect,
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
import { ACCOUNT__DYNAMODB, imgPaths, PARTICIPANT__DYNAMODB, STUDY_SIMPLE__DYNAMODB } from '@/utils'
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


const GRAVATAR_DEFAULT_IMAGE_URL = `https://gravatar.com/avatar/0
`


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
  const [ 
    gravatarUrl, 
    setGravatarUrl
  ] = useState<string>(GRAVATAR_DEFAULT_IMAGE_URL)
  const [ 
    isLoadingGravatarUrl, 
    setIsLoadingGravatarUrl
  ] = useState<boolean>(false)
  const [ isVisible, setIsVisible ] = useState<boolean>(false)

  // --------------------- `OnClick` Functions Handlers ------------------------
  const toggleDropdown = () => {
    setIsVisible(!isVisible)
  }


  async function getGravatarUrl(
    userEmail: string
  ) {
    try {
      const apiEndpoint = `/api/v1/auth/gravatar-url?email=${userEmail}`
      const response = await fetch(apiEndpoint, { method: 'GET' })
      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 405) {
        throw new Error(json.error)
      } else if (response.status === 200) {
        const gravatarUrl_ = json.gravatarUrl
        setGravatarUrl(gravatarUrl_)
        setIsLoadingGravatarUrl(false)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }


  // -------------------------------- Hooks ------------------------------------
  useClickOutside(dropdownRef, () => setIsVisible(false))

  // ------------------------- `useLayoutEffect`s ------------------------------
  useLayoutEffect(() => {
    if (email !== undefined || email !== null || email !== '') {
      const requests = [
        getGravatarUrl(email),
      ]

      Promise.all(requests).then(() => { })
    }
  }, [ email ])




  return (
    <>
      <div className={ styles.dropdown } ref={ dropdownRef }>
        <div>
          {/* { isLoading && user ? ( */}
          { isLoadingGravatarUrl && !email ? (
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
                  // src={ user && (user.picture ?? '') }
                  src={ gravatarUrl }
                  className={ styles.img }
                  onClick={ toggleDropdown }
                  style={ {
                    position: 'relative',
                    top: '3px',
                    right: '-7px',
                    boxShadow: isVisible
                      ? '0px 3px 5px 1.5px rgba(0, 75, 118, 0.5)'
                      : ''
                  } }
                />
              </div>
            </>
          )}
        </div>


        { isVisible && (
          <Fragment key={ `dropdown-menu` }>
            <div 
              className={ 
                `${styles['dropdown-content']} ${isVisible ? 'slideIn' : 'slideOut'}`
              }
            >
              { links.map((link: NavLink, i: number) => (
                <Fragment
                  key={ i }
                >
                  <ProgressBarLink
                    href={ link.href }
                    className={ styles['dropdown-link'] }
                  >
                    { i === 0 
                      ? (
                        <>
                        <div className={ styles.username }>
                          <div style={ definitelyCenteredStyle }>
                            <p>
                              {/* { user?.name } */}
                              { email }
                            </p>
                          </div>
                          <div className={ styles['view-profile'] }>
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