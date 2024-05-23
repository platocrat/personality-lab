// Externals
import Link from 'next/link'
import { FC, Fragment, useState } from 'react'
// Locals
// CSS
import styles from '@/app/page.module.css'



type StudiesProps = {

}


const BUTTONS = [
  { text: 'Create Study', href: '/create-study'},
  { text: 'View Studies', href: '/view-studies'},
]


const Studies: FC<StudiesProps> = ({ }) => {
  return (
    <div
      style={{
        gap: '24px',
        display: 'flex',
        marginTop: '24px',
      }}
    >
      { BUTTONS.map((btn, i: number) => (
        <Fragment key={ i }>
          <Link href={ btn.href }>
            <button 
              style={{ width: '125px' }}
              className={ styles.button }
            >
              { btn.text }
            </button>
          </Link>
        </Fragment>
      )) }
    </div>
  )
}

export default Studies