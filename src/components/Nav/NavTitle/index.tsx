// Externals
import Link from 'next/link'
// Locals
// CSS
import styles from '@/components/Nav/Nav.module.css'


const navTitleText = `Nav Title`


/**
 * @dev Left-aligned
 */
const NavTitle = ({ }) => {
  return (
    <>
      <div className={ styles.navTitle }>
        <Link href='/'>
          <h1>{ navTitleText }</h1>
        </Link>
      </div>
    </>
  )
}

export default NavTitle