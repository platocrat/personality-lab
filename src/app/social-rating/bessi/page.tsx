// Locals
import Bessi from '@/sections/social-rating/bessi'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



export default function _() {
  return (
    <>
      <main className={ `${styles.main}` }>
        <div
          style={ {
            ...definitelyCenteredStyle,
            flexDirection: 'column',
          } }
        >
          <Bessi />
        </div>
      </main>
    </>
  )
}