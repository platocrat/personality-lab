// Externals
import { CSSProperties, FC, Fragment, ReactNode } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/Nav/LeftHand/LeftHandNav.module.css'


type LeftHandNavProps = {
  children: ReactNode
  options?: {
    mainContentStyle?: CSSProperties
  }
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
  justifyContent: 'center',
  fontSize: 'clamp(12.5px, 1.70vw, 14px)'
}



const BUTTONS = [
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='new'>➕</span>
        <p style={ sidebarLinkTextStyle }>{ `New Study` }</p>
      </div>
    ),
    href: '/create-study',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='search'>🔍</span>
        <p style={ sidebarLinkTextStyle }>{ `Studies` }</p>
      </div>
    ),
    href: '/view-studies',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='edit'>📝</span>
        <p style={ sidebarLinkTextStyle }>{ `Assessments` }</p>
      </div>
    ),
    href: '/assessments',
  },
]


const LeftHandNav: FC<LeftHandNavProps> = ({
  options,
  children,
}) => {
  return (
    <>
      <div className={ styles.container }>
        <div className={ styles.sidebar }>
          { BUTTONS.map((btn, i: number) => (
            <Fragment key={ i }>
              <ProgressBarLink href={ btn.href }>
                <button className={ styles.sidebarLink }>
                  { btn.text }
                </button>
              </ProgressBarLink>
            </Fragment>
          )) }
        </div>
        <div 
          className={ styles.mainContent }
          style={{
            ...options?.mainContentStyle
          }}
        >
          {/* Main content goes here */ }
          { children }
        </div>
      </div>
    </>
  )
}

export default LeftHandNav