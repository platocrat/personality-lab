// Externals
import { Inter } from 'next/font/google'
// Locals
// Sections
import SignInOrSignUp from '@/sections/sign-in-or-sign-up'
import PersonalityAssessments from '@/sections/assessments'
// CSS
import styles from './page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        <SignInOrSignUp />
        <PersonalityAssessments />
      </main>
    </>
  )
}