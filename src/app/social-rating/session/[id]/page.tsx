// Locals
import SocialRatingSession from '@/sections/social-rating/session'
// CSS
import styles from '@/app/page.module.css'



export default function _({ }) {
  return (
    <>
      <main 
        style={{ top: '8px' }}
        className={ `${styles.main}` }
      >
        <SocialRatingSession />
      </main>
    </>
  )
}