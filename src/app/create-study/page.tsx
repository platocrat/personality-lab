// Locals
// Sections
import CreateStudy from '@/sections/admin-portal/studies/create'
// CSS
import styles from '@/app/page.module.css'


const PAGE_FRAGMENT_ID = 'create-study'



export default function _() {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <CreateStudy />
      </main>
    </>
  )
}