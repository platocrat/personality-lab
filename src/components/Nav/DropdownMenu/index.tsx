// Externals
import Link from 'next/link'
import Image from 'next/image'
import { FC, Fragment, ReactNode, useState } from 'react'
// Locals
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
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleDropdown = () => setIsVisible(!isVisible)


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
            </div>
          </Fragment>
        ) }
      </div>
    </>
  )
}

export default DropdownMenu