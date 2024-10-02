// Externals
import { CSSProperties, FC, Fragment, ReactNode, useContext } from 'react'
// Locals
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// // Hooks
// import useAccount from '@/hooks/useAccount'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/components/Nav/LeftHand/LeftHandNav.module.css'


// --------------------------------- Types -------------------------------------
type LeftHandNavProps = {
  children: ReactNode
  options?: {
    mainContentStyle?: CSSProperties
  }
}


// ------------------------------ Constants ------------------------------------
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
        <span 
          role='img' 
          aria-label='new' 
          // Left and right margin is necessary to align the starting position 
          // of the `+` emoji with the other emojis and to align the starting
          // position of `New Study` with all of the other sidebar texts.
          style={{ marginLeft: '-2px', marginRight: '2px' }}
        >
          { `➕` }
        </span>
        <p style={ sidebarLinkTextStyle }>{ `New Study` }</p>
      </div>
    ),
    href: '/create-study',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='search'>{ `🔍` }</span>
        <p style={ sidebarLinkTextStyle }>{ `Studies` }</p>
      </div>
    ),
    href: '/view-studies',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='edit'>{ `📝` }</span>
        <p style={ sidebarLinkTextStyle }>{ `Assessments` }</p>
      </div>
    ),
    href: '/assessments',
  },
  {
    text: (
      <div style={ sidebarLinkTextContainerStyle }>
        <span role='img' aria-label='edit'>{ `🎮` }</span>
        <p style={ sidebarLinkTextStyle }>{ `Social Rating` }</p>
      </div>
    ),
    href: '/social-rating',
  },
]



// --------------------------- Function Component ------------------------------
const LeftHandNav: FC<LeftHandNavProps> = ({
  options,
  children,
}) => {
  // Hooks
  // const {
  //   isGlobalAdmin,
  //   isParticipant,
  // } = useAccount()
  
  // Contexts
  const {
    isGlobalAdmin,
    isParticipant,
    // isFetchingSession
  } = useContext<SessionContextType>(SessionContext)


  return (
    <>
      <div className={ styles.container }>
        <div className={ styles.sidebar }>
          { BUTTONS.map((btn, i: number) => (
            <Fragment key={ i }>
              { btn.href === '/create-study' && !isGlobalAdmin
                ? null
                : (
                <>
                  { btn.href === 'view-studies' && !isParticipant 
                    ? null 
                    : (
                    <>
                      <ProgressBarLink href={ btn.href }>
                        <button className={ styles.sidebarLink }>
                          { btn.text }
                        </button>
                      </ProgressBarLink>
                    </>
                  )}
                </>
              )}
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