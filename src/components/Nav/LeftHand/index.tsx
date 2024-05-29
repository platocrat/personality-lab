// Externals
import Link from 'next/link'
import { CSSProperties, FC, Fragment, ReactNode } from 'react'
// Locals
// CSS
import styles from '@/components/Nav/LeftHand/LeftHandNav.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type LeftHandNavProps = {
  children: ReactNode
}


const sidebarLinkTextContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: '28px',
  padding: '0', // Add padding for vertical spacing
  gap: '10px', // Add gap between emoji and text
}

const sidebarLinkTextStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}



const BUTTONS = [
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='new'>➕</span>
        <p>{ `New Study` }</p>
      </div>
    ),
    href: '/create-study',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='search'>🔍</span>
        <p>{ `Studies` }</p>
      </div>
    ),
    href: '/view-studies',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='edit'>📝</span>
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
    <>
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
    </>
  )
}

export default LeftHandNav