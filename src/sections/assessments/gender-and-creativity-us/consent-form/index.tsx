'use client'

// Externals
import Link from 'next/link'
import { FC, Fragment, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
import ExternalLink from '@/components/Anchors/ExternalLink'
// Sections
import Preface from './preface'
import AssessmentButton from '../../../../app/components/assessment-button'
// Enums
import { YesOrNo } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { paragraphSectionStyle } from './preface'



type ConsentFormProps = { }



const href = `/gender-and-creativity-us/assessment`
const buttonText = `Next`

const inputLabels = [
  { id: YesOrNo.No.toLowerCase(), name: YesOrNo.No },
  { id: YesOrNo.Yes.toLowerCase(), name: YesOrNo.Yes },
]

// const title = `Consent Form`



const FinalConsentLabel = () => {
  return (
    <>
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
    </>
  )
}





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
      legend: `Religious or philosophical beliefs`,
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
          <Preface />

          { bubbleInputs.map((bInput, i: number) => (
            <Fragment key={ `bubble-inputs-for-consent-form-${i}` }>
              <RadioOrCheckboxInput
                itemIndex={ i }
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
          <RadioOrCheckboxInput 
            inputLabels={ inputLabels }
            legend={ <FinalConsentLabel /> }
            onChange={ handleOnFinalConsent }
            inputName='consent-to-participate-in-research'
          />
        </div>

      </form>

      <AssessmentButton href={ href } buttonText={ buttonText } />
    </Fragment>
  )
}

export default ConsentForm