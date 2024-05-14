'use client'

// Externals
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, Fragment, useEffect, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
import ExternalLink from '@/components/Anchors/ExternalLink'
// Sections
import Preface from './preface'
// Enums
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF, YesOrNo } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { paragraphSectionStyle } from './preface'
import { definitelyCenteredStyle } from '@/theme/styles'



type GenderAndCreativityUsConsentFormProps = { }



const BUTTON_TEXT = `Next`


const inputLabels = [
  { id: YesOrNo.No.toLowerCase(), name: YesOrNo.No },
  { id: YesOrNo.Yes.toLowerCase(), name: YesOrNo.Yes },
]




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





const GenderAndCreativityUsConsentForm: FC<GenderAndCreativityUsConsentFormProps> = ({  }) => {
  // Hooks
  const router = useRouter()
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
  // Custom
  const [ consentInfo, setConsentInfo ] = useState<any>(null)


  // ------------------ Form selection event handlers --------------------------
  const onRacialOrEthnicConsentChange = (e: any, i: number): void => {
    setRacialOrEthnicConsent(i === 0 ? false : true)
  }

  const onPoliticalOpinionsConsentChange = (e: any, i: number): void => {
    setPoliticalOpinionsConsent(i === 0 ? false : true)
  }

  const onRelgiousOrPhilosophhicalBeliefsConsentChange = (e: any, i: number): void => {
    setReligiousOrPhilosophicalBeliefsConsent(i === 0 ? false : true)
  }

  const onHealthDataConsentChange = (e: any, i: number): void => {
    setHealthDataConsent(i === 0 ? false : true)
  }

  const onDataConcerningSexLifeConsentChange = (e: any, i: number): void => {
    setSexLifeAndOrientationConsent(i === 0 ? false : true)
  }
  
  const onFinalConsentChange = (e: any, i: number): void => {
    setFinalConsent(i === 0 ? false : true)
  }



  const inputs: {
    legend: string
    inputName: string
    onChange: (e: string, i: number) => void
  }[] = [
    { 
      legend: `Racial or ethnic origin`,
      inputName: 'racial-or-ethnic-consent',
      onChange: onRacialOrEthnicConsentChange,
    },
    { 
      legend: `Religious or philosophical beliefs`,
      inputName: 'political-opinions-consent',
      onChange: onPoliticalOpinionsConsentChange,
    },
    { 
      legend: `Racial or ethnic origin`,
      inputName: 'religious-or-philosophical-beliefs-consent',
      onChange: onRelgiousOrPhilosophhicalBeliefsConsentChange,
    },
    { 
      legend: `Health data`,
      inputName: 'health-data-consent',
      onChange: onHealthDataConsentChange,
    },
    { 
      legend: `Data concerning a natural person's sex life or sexual orientation`,
      inputName: 'sex-life-and-orientation-consent',
      onChange: onDataConcerningSexLifeConsentChange,
    }
  ]


  // ------------------------ Async functions ----------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault() 

    const _consentInfo = {
      finalConsent: finalConsent,
      healthDataConsent: healthDataConsent,
      racialOrEthnicConsent: racialOrEthnicConsent,
      politicalOpinionsConsent: politicalOpinionsConsent,
      sexLifeAndOrientationConsent: sexLifeAndOrientationConsent,
      religiousOrPhilosophicalBeliefsConsent: religiousOrPhilosophicalBeliefsConsent,
    }

    setConsentInfo(_consentInfo)

    // await sendConsentInfoToDynamoDB

    // Use router to route the user to the assessment page
    router.push(GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF)
  }



  useEffect(() => {
    console.log(`consentInfo: `, consentInfo)
  }, [consentInfo])




  return (
    <Fragment key={ `gender-and-creativity-us-consent-form` }>
      <form 
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <div>
          <Preface />

          { inputs.map((bInput, i: number) => (
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
            onChange={ onFinalConsentChange }
            inputName='consent-to-participate-in-research'
          />
        </div>

        <div style={{ float: 'right' }}>
          <button className={ styles.button } style={ { width: '80px' } }>
            { BUTTON_TEXT }
          </button>
        </div>

      </form>

    </Fragment>
  )
}

export default GenderAndCreativityUsConsentForm