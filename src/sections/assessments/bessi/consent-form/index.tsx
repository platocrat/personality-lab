// Locals
import Content from './content'
import AssessmentButton from '../../../../components/Buttons/Assessment'


const href = `/bessi/assessment`
const buttonText = `I agree`



const BessiConsentForm = ({ }) => {
  return (
    <>
      <Content />
      <AssessmentButton href={ href } buttonText={ buttonText } />
    </>
  )
}

export default BessiConsentForm