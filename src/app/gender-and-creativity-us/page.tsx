// Locals
// Sections
import GenderAndCreativityUsConsentForm from '@/sections/assessments/gender-and-creativity-us/forms/consent'
// CSS
import styles from '@/app/page.module.css'


const PAGE_FRAGMENT_ID = 'consent-info'



export default function _() {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <GenderAndCreativityUsConsentForm pageFragmentId={ PAGE_FRAGMENT_ID } />
      </main>
    </>
  )
}