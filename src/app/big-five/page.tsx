// Locals
// Sections
import BigFiveConsentForm from '@/sections/assessments/big-five/forms/consent'
// CSS
import styles from '@/app/page.module.css'


const PAGE_FRAGMENT_ID = 'consent-info'



export default function _() {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <BigFiveConsentForm pageFragmentId={ PAGE_FRAGMENT_ID } />
      </main>
    </>
  )
}