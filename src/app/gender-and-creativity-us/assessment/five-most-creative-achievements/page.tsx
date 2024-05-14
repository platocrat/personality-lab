// Externals
import { FC } from 'react'

// Locals
// Sections
import FiveMostCreativeAchievementsForm from '@/sections/assessments/gender-and-creativity-us/forms/five-most-creative-achievements'
// CSS
import styles from '@/app/page.module.css'



type FiveMostCreativeAchievementsProps = {}


const PAGE_FRAGMENT_ID = `five-most-creative-achievements`



const FiveMostCreativeAchievements: FC<FiveMostCreativeAchievementsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <FiveMostCreativeAchievementsForm pageFragmentId={ PAGE_FRAGMENT_ID } />
      </main>
    </>
  )
}

export default FiveMostCreativeAchievements