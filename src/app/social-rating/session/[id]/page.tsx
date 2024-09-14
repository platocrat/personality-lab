// Externals
import { FC } from 'react'
// Locals
import SocialRatingSessionSection from '@/sections/social-rating/session'
// CSS
import styles from '@/app/page.module.css'



type SocialRatingSessionProps = {
  // params: {
  //   sessionId: string
  // }
}



// const SocialRatingSession: FC<SocialRatingSessionProps> = ({
//   // params
// }) => {
export default function _({ }) {
  // // URL params
  // const { sessionId } = params


  return (
    <>
      <main className={ `${styles.main}` }>
        <SocialRatingSessionSection 
          // sessionId={ sessionId }
        />
      </main>
    </>
  )
}

// export default SocialRatingSession