'use client'

// Locals
import BessiAge from './age'
import BessiGender from './gender'
import BessiLocation from './location'
import BessiSocialClass from './social-class'
import BessiEnglishFluency from './english-fluency'
import BessiRaceOrEthnicity from './raceOrEthnicity'
import BessiPriorCompletion from './prior-completion'
import BessiEducationAndWork from './education-and-work'
import BessiMarriageAndFamily from './marriage-and-family'
// Enums
// CSS
import styles from '@/app/page.module.css'



const Title = () => {
  return (
    <>
      <tr style={ { display: 'table-row' } }>
        <th
          className={ styles.bessi_assessment_th }
          style={ { textAlign: 'left' } }
        >
          <strong>
            <span
              style={ {
                fontFamily: `Arial, Helvetica, sans-serif`,
                fontSize: `14pt`,
                fontWeight: ` bold`,
              } }
            >
              { `About You` }
            </span>
          </strong>
        </th>
      </tr>
    </>
  )
}

const Questions = () => {
  return (
    <>
      <tr style={ { display: 'table-row' } }>
        <td
          className={ styles.bessi_assessment_td }
          style={ { textAlign: 'left' } }
        >
          {/**
            * @dev The `div` below subtracts vertical space from the 
            * `Background` text.
            */}
          <div style={{ marginBottom: '-12px' }}/>
          <BessiPriorCompletion />
          {/* <BessiGender />
          <BessiAge />
          <BessiRaceOrEthnicity />
          <BessiEnglishFluency />
          <BessiSocialClass />
          <BessiLocation />
          <BessiEducationAndWork />
          <BessiMarriageAndFamily /> */}
        </td>
      </tr>
    </>
  )
}


const BessiDemographicQuestions = () => {
  return (
    <>
      <table className={ styles.bessi_assessment_table }>
        <tbody className={ styles.bessi_assessment_tbody }>
          <Title />
          <Questions />
        </tbody>
      </table>
    </>
  )
}

export default BessiDemographicQuestions