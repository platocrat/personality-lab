// Externals
import Link from 'next/link'
import { FC, Fragment, ReactNode } from 'react'
// Locals
// CSS
import styles from '@/components/Nav/LeftHand/LeftHandNav.module.css'


type LeftHandNavProps = {
  children: ReactNode
}


const BUTTONS = [
  { text: 'Create Study', href: '/create-study' },
  { text: 'View Studies', href: '/view-studies' },
]


const LeftHandNav: FC<LeftHandNavProps> = ({
  children
}) => {
  return (
    <div className={ styles.container }>
      <div className={ styles.sidebar }>
        { BUTTONS.map((btn, i: number) => (
          <Fragment key={ i }>
            <Link href={ btn.href }>
              <button className={ styles.sidebarLink }>
                { btn.text }
              </button>
            </Link>
          </Fragment>
        )) }
      </div>
      <div className={ styles.mainContent }>
        {/* Main content goes here */ }
        { children }
      </div>
    </div>
  )
}

export default LeftHandNav