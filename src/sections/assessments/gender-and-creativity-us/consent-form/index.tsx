'use client'

// Externals
import Link from 'next/link'
import { FC, Fragment, useState } from 'react'
// Locals
import ExternalLink from '@/components/Anchors/ExternalLink'
// CSS
import styles from '@/app/page.module.css'
import { BubbleRadioInput } from '@/components/Input/Radio'
import AssessmentButton from '../../components/assessment-button'



type ConsentFormProps = {
  
}



const href = `/gender-and-creativty-us/assessment`
const buttonText = `Next`


const paragraphSectionStyle = {
  margin: '0px 0px 24px 0px'
}

const inputLabels = [
  { id: '0', name: 'No' },
  { id: '1', name: 'Yes' },
]

// const title = `Consent Form`




const ConsentForm: FC<ConsentFormProps> = ({  }) => {
  // States
  const [ 
    racialOrEthnicConsent, 
    setRacialOrEthnicConsent 
  ] = useState<boolean>(false)
  const [ 
    politicalOpinionsConsent, 
    setPoliticalOpinionsConsent 
  ] = useState<boolean>(false)
  const [
    sexLifeAndOrientationConsent, 
    setSexLifeAndOrientationConsent 
  ] = useState<boolean>(false)
  const [
    religiousOrPhilosophicalBeliefsConsent, 
    setReligiousOrPhilosophicalBeliefsConsent 
  ] = useState<boolean>(false)
  const [ finalConsent, setFinalConsent ] = useState<boolean>(false)
  const [ healthDataConsent, setHealthDataConsent ] = useState<boolean>(false)


  // ------------------ Form selection event handlers --------------------------
  const handleOnRacialOrEthnicConsent = (e: any, i: number): void => {
    setRacialOrEthnicConsent(i === 0 ? false : true)
  }

  const handleOnPoliticalOpinionsConsent = (e: any, i: number): void => {
    setPoliticalOpinionsConsent(i === 0 ? false : true)
  }

  const handleOnRelgiousOrPhilosophhicalBeliefsConsent = (e: any, i: number): void => {
    setReligiousOrPhilosophicalBeliefsConsent(i === 0 ? false : true)
  }

  const handleOnHealthDataConsent = (e: any, i: number): void => {
    setHealthDataConsent(i === 0 ? false : true)
  }

  const handleOnDataConcerningSexLifeConsent = (e: any, i: number): void => {
    setSexLifeAndOrientationConsent(i === 0 ? false : true)
  }
  
  const handleOnFinalConsent = (e: any, i: number): void => {
    setFinalConsent(i === 0 ? false : true)
  }




  const bubbleInputs: {
    legend: string
    inputName: string
    onChange: (e: string, i: number) => void
  }[] = [
    { 
      legend: `Racial or ethnic origin`,
      inputName: 'racial-or-ethnic-consent',
      onChange: handleOnRacialOrEthnicConsent,
    },
    { 
      legend: `Relgious or philosophical beliefs`,
      inputName: 'political-opinions-consent',
      onChange: handleOnPoliticalOpinionsConsent,
    },
    { 
      legend: `Racial or ethnic origin`,
      inputName: 'religious-or-philosophical-beliefs-consent',
      onChange: handleOnRelgiousOrPhilosophhicalBeliefsConsent,
    },
    { 
      legend: `Health data`,
      inputName: 'health-data-consent',
      onChange: handleOnHealthDataConsent,
    },
    { 
      legend: `Data concerning a natural person's sex life or sexual orientation`,
      inputName: 'sex-life-and-orientation-consent',
      onChange: handleOnDataConcerningSexLifeConsent,
    }
  ]






  return (
    <Fragment key={ `gender-and-creativity-us-consent-form` }>
      <form className={ styles.assessmentWrapper }>

        <div className='form-group form-row optional item-note'>
          <div className='control-label'>
            <p style={ paragraphSectionStyle }>
              {
                `You are being asked to participate in a voluntary research study. The
              purpose of this study is to investigate gender differences in
              characteristics that are linked to creativity. Participating in this
              study will involve completing a survey, and your participation will last
              approximately 25 minutes on average. There are no risks related to this
              research beyond those encountered in daily life; benefits related to
              this research include contributing to research on personality science.
              You will also have the opportunity to receive feedback on several
              measures of personality that you complete.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              {
                `You should not be physically located in China when participating in this
              study.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              { `Principal Investigator Name and Title: Brent Roberts, Professor` }
              <br />
              { 
                `Department and Institution: Psychology, University of Illinois at Urbana-Champaign`
              }
              <br />
              { `Contact Information: ` }
              <ExternalLink  linkText={ `217-333-2644` } />

              { `; ` }
              
              <ExternalLink linkText={ `bwrobrts@illinois.edu` } />
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `What procedures are involved?` }
              </strong>
              <br />
              { 
                `You will be asked to complete questions about personality, interests, and creative achievements.`
              }
              <br />
              { `Your participation will last approximately 25 minutes on average.` }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `What are the potential risks and discomforts?` }
              </strong>
              <br />
              { 
                `Potential risks and discomforts are minimal and do not exceed those encountered in everyday computer/internet usage.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              {
                `Your participation in this research is voluntary. Your decision whether or not to participate will not affect your current or future dealings with the University of Illinois at Urbana-Champaign. If you decide to participate, you are free to withdraw at any time without affecting that relationship. However, by withdrawing from the study, you will not receive credit.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `Are there benefits to participating in the research?` }
              </strong>
              <br />
              { 
                `We will provide feedback to you for a personality trait measure and an interest measure. This feedback will show you where you score in relation to other people on the same measures.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `Will my study-related information be kept confidential?` }
              </strong>
              <br />
              {
                `Faculty, staff, students, and others with permission or authority to see your study information will maintain its confidentiality to the extent permitted and required by laws and university policies. The names or personal identifiers of participants will not be published or presented.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                {
                  `Will I be reimbursed for any expenses or paid for my participation in this research?`
                }
              </strong>
              <br />
              You will not be offered payment for being in this study.
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `Will data collected from me be used for any other research?` }
              </strong>
              <br />
              { 
                `Your de-identified information could be used for future research without additional informed consent.` 
              }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `Who should I contact if I have questions?` }
              </strong>
              <br />
              { 
                `If you have questions about this project, you may contact Brent Roberts at `
              }
              <ExternalLink linkText={ `217-333-2644` } />
              { ` or ` }
              <ExternalLink linkText={ `bwrobrts@illinois.edu` } />
              { `, or you may contact Rodrigo Fabretti at ` }
              <ExternalLink linkText={ `217-418-7560` } />
              { ` or ` }
              <ExternalLink linkText={ `rr27@illinois.edu` } />
              {`.`}
              <br />
              { 
                `If you have any questions about your rights as a participant in this study or any concerns or complaints, please contact the University of Illinois at Urbana-Champaign Office for the Protection of Research Subjects at `  
              }
              <ExternalLink linkText={ `217-333-2670` } />
              { ` or via email at ` } 
              <ExternalLink linkText={ `irb@illinois.edu` } />
              {`.` }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { `General Data Protection Regulation (GDPR) Notice/Consent` }
              </strong>
              <br />
              { 
                `The University of Illinois Web Privacy Notice and Supplemental Privacy Notice for certain persons in the European Economic Area and the United Kingdom describe in detail how the University processes personal information.`
              }
              <br />
              { 
                `To assist in the analysis of our research, we ask in the following section certain questions about you. Some of the demographic questions pertain to special categories of personal information under Article 9 of the GDPR. As with all of the questions in the survey, answering the questions involving special categories of personal information is completely voluntary.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              { 
                `The legal basis for collecting the special category personal information is consent, which you may withdraw at any time; however, doing so will not affect the processing of your personal information before your withdrawal of consent.`
              }
            </p>
            <p style={ paragraphSectionStyle }>
              <strong>
                { 
                  `I consent to the collection, use, retention (including through the use of cloud storage services hosted by third parties); and sharing with the research team of personal information concerning my:`
                }
              </strong>
            </p>
          </div>


          { bubbleInputs.map((bInput, i: number) => (
            <Fragment key={ `bubble-inputs-for-consent-form-${i}` }>
              <BubbleRadioInput
                legend={ bInput.legend }
                inputLabels={ inputLabels }
                onChange={ bInput.onChange }
                inputName={ bInput.inputName }
                options={ { isVertical: true } }
              />
            </Fragment>
          )) }
        </div>

        <div style={ paragraphSectionStyle }>
          <BubbleRadioInput 
            inputLabels={ inputLabels }
            onChange={ handleOnFinalConsent }
            inputName='consent-to-participate-in-research'
            legend={
              <label>
                <p style={ paragraphSectionStyle }>
                  {
                    `I understand that even if I answered 'yes' to any or all of these questions, I may still choose not to answer the associated survey questions. However, if I answer 'no' to any or all of these questions but provide the information in the survey anyway, the conflict will be resolved by deleting my special category information.`
                  }
                </p>
                <p style={ paragraphSectionStyle }>
                  {
                    `Please print this consent form if you would like to retain a copy for your records.`
                  }
                </p>
                <p>
                  {
                    `I have read the above information. I have been given an opportunity to ask questions and my questions have been answered to my satisfaction. I agree to participate in this research.`
                  }
                </p>
              </label>
            }
          />
        </div>

      </form>

      <AssessmentButton href={ href } buttonText={ buttonText } />
    </Fragment>
  )
}

export default ConsentForm