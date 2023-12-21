// Externals
import {
  FC,
  Fragment,
  useContext,
} from 'react'
// Locals
import BessiDemographicQuestions from './questions'
import BessiRaceOrEthnicityQuestion from './questions/raceOrEthnicity'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// CSS
import styles from '@/app/page.module.css'


export const inputMarginStyle = {
  margin: '0px 12px 0px 12px'
}


const IntroductoryText = () => {
  const text = `Before submitting your responses, please help us improve this site by answering a few demographic questions about yourself. These questions are entirely optional and will not affect your feedback.`

  return (
    <>
      <p>{text}</p>
      <br />
    </>
  )
}


const BessiDemographicQuestionnaire: FC = () => {
  return (
    <>
      <div style={ { marginBottom: '48px' } }>
        <div className={ styles.assessmentSubtitle }>
          <IntroductoryText />
        </div>

        <BessiDemographicQuestions />
      </div>
    </>
  )
}

export default BessiDemographicQuestionnaire