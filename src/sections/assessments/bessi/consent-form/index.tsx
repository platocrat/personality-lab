// Externals
import Link from 'next/link'
// Locals
import Content from './content'
import AssessmentButton from '../../../../app/components/assessment-button'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'


const href = `/bessi/assessment`
const buttonText = `I agree`



const BessiConsentForm = ({ }) => {
  return (
    <>
      <Content />
      <AssessmentButton href={ href }buttonText={ buttonText } />
    </>
  )
}

export default BessiConsentForm