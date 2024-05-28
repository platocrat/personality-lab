// Locals
// Sections
import LeftHandNav from '@/components/Nav/LeftHand'
import PersonalityAssessments from '@/sections/assessments'


const PAGE_FRAGMENT_ID = 'view-studies'



export default function _() {
  return (
    <>
      <main>
        <LeftHandNav>
          <PersonalityAssessments />
        </LeftHandNav>
      </main>
    </>
  )
}