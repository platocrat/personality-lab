// Externals
import { FC } from 'react'

// Locals
// Sections
import MusicForm from '@/sections/assessments/gender-and-creativity-us/forms/music'
// CSS
import styles from '@/app/page.module.css'



type MusicProps = {}




const Music: FC<MusicProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <MusicForm />
      </main>
    </>
  )
}

export default Music