// Locals
// Sections
import ViewStudies from '@/sections/admin-portal/studies/view'
// CSS
import styles from '@/app/page.module.css'


const PAGE_FRAGMENT_ID = 'view-studies'



export default function _() {
  return (
    <>
      <main 
        className={ `${styles.main} ` }
        style={{ 
          maxWidth: '900px'
        }}
      >
        <ViewStudies />
      </main>
    </>
  )
}