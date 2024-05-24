// Externals
import Link from 'next/link'
import { FC, Fragment, ReactNode } from 'react'
// Locals
// CSS
import styles from '@/components/Nav/LeftHand/LeftHandNav.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type LeftHandNavProps = {
  children: ReactNode
}


const BUTTONS = [
  { 
    text: '+ New Study', 
    href: '/create-study',
  },
  { 
    text: (
      <div style={ definitelyCenteredStyle }>
        <p style={{ marginRight: '8px' }}>{ '🔍' }</p>
        <p>{ `Studies` }</p>
      </div>
    ), 
    href: '/view-studies',
  },
  { 
    text: (
      <div style={ definitelyCenteredStyle }>
        <p style={{ marginRight: '8px' }}>{ '📝' }</p>
        <p>{ `Assessments` }</p>
      </div>
    ), 
    href: '/assessments',
  },
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