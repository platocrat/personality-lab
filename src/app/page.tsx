// Externals
import { Inter } from 'next/font/google'
// Locals
// Sections
import SignIn from '@/sections/sign-in'
import PersonalityAssessments from '@/sections/assessments'
// CSS
import styles from './page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        <SignIn />
        <PersonalityAssessments />
      </main>
    </>
  )
}