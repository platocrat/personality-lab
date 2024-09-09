// Locals
import FictionalCharacters from '@/sections/social-rating/games/fictional-characters'
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
          <FictionalCharacters />
        </div>
      </main>
    </>
  )
}