// Locals
// Sections
import CreateStudy from '@/sections/admin-portal/studies/create'
// CSS
import styles from '@/app/page.module.css'
import LeftHandNav from '@/components/Nav/LeftHand'


const PAGE_FRAGMENT_ID = 'create-study'



export default function _() {
  return (
    <>
      <main>
        <LeftHandNav>
          <CreateStudy />
        </LeftHandNav>
      </main>
    </>
  )
}