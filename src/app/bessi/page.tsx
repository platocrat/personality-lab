'use client';

// Externals
import { Inter } from 'next/font/google'
// Locals
// Sections
import Bessi from '@/sections/assessments/bessi'
// CSS
import styles from '@/app/page.module.css'


const inter = Inter({ subsets: ['latin'] })


export default function _() {
  return (
    <>
      <main className={ `${styles.main} ${inter.className}` }>
        <Bessi />
      </main>
    </>
  )
}