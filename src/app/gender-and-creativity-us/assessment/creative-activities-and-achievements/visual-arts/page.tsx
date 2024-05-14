// Externals
import { FC } from 'react'

// Locals
// Sections
import VisualArtsForm from '@/sections/assessments/gender-and-creativity-us/forms/visual-arts'
// CSS
import styles from '@/app/page.module.css'



type VisualArtsProps = {}




const VisualArts: FC<VisualArtsProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <VisualArtsForm />
      </main>
    </>
  )
}

export default VisualArts