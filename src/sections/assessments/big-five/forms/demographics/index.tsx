'use client'

// Externals
import { useRouter } from 'next/navigation'
import { Fragment, useContext, useState } from 'react'
// Locals
import FormButton from '@/components/Buttons/Form'
import InputWrapper from '@/components/Input/Wrapper'
import { RadioOrCheckboxInput } from '@/components/Input'
import TextOrNumberInput from '@/components/Input/TextOrNumber'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Utils
import {
  Religion,
  BIG_FIVE_PATH,
  getInputLabels,
  RaceOrEthnicity,
  Gender__BigFive,
  MaritalStatus__BigFive,
  BigFiveDemographicsType,
  BIG_FIVE_ASSESSMENT_HREF,
  INIT__BIG_FIVE_DEMOGRAPHICS,
  CurrentEmploymentStatus__BigFive,
  HighestLevelOfEducation__BigFive,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${BIG_FIVE_ASSESSMENT_HREF}/spend-time-with-others`
const BUTTON_TEXT = `Next`


const checkboxStyle = {
  questionBodyStyle: {
    width: '100%',
  },
  radioButtonLabelStyle: {
    padding: '8px 18px',
  },
  radioButtonInputStyle: {
    top: '0px',
  },
}



const DemographicsForm = ({ }) => {
  // Hooks
  const router = useRouter()

  // Contexts
  const {
    // State variables
    age,
    gender,
    religion,
    familySize,
    raceOrEthnicity,
    currentMaritalStatus,
    areaOfScienceTraining,
    highestEducationLevel,
    annualHouseholdIncome,
    currentEmploymentStatus,
    // onChange event handlers
    onAgeChange,
    onGenderChange,
    onReligionChange,
    onFamilySizeChange,
    onRaceOrEthnicityChange,
    onCurrentMaritalStatusChange,
    onAreaOfScienceTrainingChange,
    onHighestEducationLevelChange,
    onAnnualHouseholdIncomeChange,
    onCurrentEmploymentStatusChange,
  } = useContext(UserDemographicContext)
  // React states
  const [
    bigFiveDemographics,
    setBigFiveDemographics
  ] = useState<BigFiveDemographicsType>(
    INIT__BIG_FIVE_DEMOGRAPHICS
  )
  // Booleans
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ hasSubmitted, setHasSubmitted ] = useState(false)


  const getFragmentKey = (i: number) => `${
    BIG_FIVE_PATH
  }--demographics--radio-or-checkbox-inputs-${i}`



  const inputWrapperOptions = {
    splitLabelAndInput: true,
    css: {
      p: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
    classNames: {
      pClassName: styles.inputWrapperP,
      spanClassName: styles.inputWrapperSpan,
    }
  } 


  const inputs = [
    {
      onChange: onGenderChange,
      name: 'what-is-your-gender',
      legend: `What is your gender?`,
      inputLabels: getInputLabels(Gender__BigFive),
    },
    {
      onChange: onRaceOrEthnicityChange,
      name: 'select-race-or-ethnicity',
      legend: `Please choose one or more races that you consider yourself to be:`,
      inputLabels: getInputLabels(RaceOrEthnicity),
    },
    {
      onChange: onCurrentMaritalStatusChange,
      name: `current-marital-status`,
      legend: `What is your marital status?`,
      inputLabels: getInputLabels(MaritalStatus__BigFive),
    },
    {
      onChange: onCurrentEmploymentStatusChange,
      name: 'current-employment-status',
      legend: `Which statement best describes your current employment status?`,
      inputLabels: getInputLabels(CurrentEmploymentStatus__BigFive),
    },
  ]


  async function handleOnSubmit(e: any) {
    e.preventDefault()

    setIsSubmitting(true)

    const DEMOGRAPHICS: BigFiveDemographicsType = {
      age,
      gender,
      religion,
      familySize,
      raceOrEthnicity,
      currentMaritalStatus,
      areaOfScienceTraining,
      highestEducationLevel,
      annualHouseholdIncome,
      currentEmploymentStatus,
    }

    await storeDemographicsInLocalStorage(DEMOGRAPHICS)

    setHasSubmitted(true)

    router.push(href)
  }


  async function storeDemographicsInLocalStorage(demographics) {
    const key = `${BIG_FIVE_PATH}--demographics`
    const value = JSON.stringify(demographics)
    localStorage.setItem(key, value)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 300)
  }




  return (
    <>
      <div>
        <form
          onSubmit={ (e: any) => handleOnSubmit(e) }
        >
          <InputWrapper
            label={ `What is your age?` }
            options={ inputWrapperOptions }
            input={
              <TextOrNumberInput
                name={ 'age' }
                onChange={ onAgeChange }
                controls={ { type: 'number' } }
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
          />

          { inputs.map((input, i: number) => (
            <Fragment key={ getFragmentKey(i) }>
              <RadioOrCheckboxInput
                style={ checkboxStyle }
                inputName={ input.name }
                legend={ input.legend }
                onChange={ input.onChange }
                inputLabels={ input.inputLabels }
                options={ {
                  isVertical: true,
                  type: i === 1 ? 'checkbox' : 'radio'
                } }
              />
            </Fragment>
          )) }


          <InputWrapper
            options={ inputWrapperOptions }
            label={ `What is your family size? (including yourself, in numbers only)` }
            input={
              <TextOrNumberInput
                name={ 'family-size' }
                controls={ { type: 'number' } }
                onChange={ onFamilySizeChange }
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
          />


          <InputWrapper
            options={ inputWrapperOptions }
            label={ `What is your religion?` }
            input={ 
              <select
                required={ true }
                onChange={ (e: any) => onReligionChange(e) }
                style={ { margin: '0px 0px 0px 8px' } }
                name={ `what-is-your-religion` }
              >
                <option value={ `` }>{ `Please select` }</option>
                { Object.values(Religion).map((
                  religion: string,
                  i: number
                ) => (
                  <Fragment key={ `social-class-${i}` }>
                    <option value={ religion }>
                      { religion }
                    </option>
                  </Fragment>
                )) }
              </select>
             }
          />


          <RadioOrCheckboxInput
            style={ checkboxStyle }
            options={ { isVertical: true } }
            inputName={ 'highest-level-of-education-completed' }
            onChange={ onHighestEducationLevelChange }
            inputLabels={ getInputLabels(HighestLevelOfEducation__BigFive) }
            legend={
              `What is the highest level of school you have completed or the highest degree you have received?`
            }
          />


          <InputWrapper
            options={ inputWrapperOptions }
            label={ `What area of science are you trained in?` }
            input={
              <TextOrNumberInput
                name={ 'area-of-science-trained-in' }
                onChange={ onAreaOfScienceTrainingChange }
                controls={ { type: 'text' } }
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
          />


          <InputWrapper
            options={ inputWrapperOptions }
            label={ `Please indicate your entire annual household income (average) before taxes:` }
            input={
              <TextOrNumberInput
                onChange={ onAnnualHouseholdIncomeChange }
                name={ 'annual-household-income-before-taxes' }
                controls={ { type: 'number' } }
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
          />

          <FormButton 
            buttonText={ BUTTON_TEXT }
            state={{
              isSubmitting: isSubmitting,
              hasSubmitted: hasSubmitted,
            }}
          />

        </form>
      </div>
    </>
  )
}


export default DemographicsForm