// Externals
import { FC } from 'react'

// Locals
// Sections
import CreativeCookingForm from '@/sections/assessments/gender-and-creativity-us/forms/creative-cooking'
// CSS
import styles from '@/app/page.module.css'



type CreativeCookingProps = {}




const CreativeCooking: FC<CreativeCookingProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <CreativeCookingForm />
      </main>
    </>
  )
}

export default CreativeCooking