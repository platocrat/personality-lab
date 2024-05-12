// Externals
import { FC } from 'react'
import Link from 'next/link'
// Locals
import styles from '@/app/page.module.css'


type AssessmentButtonProps = {
  href: string
  buttonText: string
}



const AssessmentButton: FC<AssessmentButtonProps> = ({
  href,
  buttonText
}) => {
  return (
    <>
      <div style={ { float: 'right' } }>
        <Link href={ href }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { buttonText }
          </button>
        </Link>
      </div>
    </>
  )
}


export default AssessmentButton