'use client'

// Externals
import { useRouter } from 'next/navigation'
import { Fragment, useContext, useState } from 'react'
// Locals
import InputWrapper from '@/components/Input/Wrapper'
import { RadioOrCheckboxInput } from '@/components/Input'
import TextOrNumberInput from '@/components/Input/TextOrNumber'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Utils
import { 
  Religion,
  getInputLabels,
  RaceOrEthnicity,
  Gender__GACUsGender,
  MaritalStatus__GACUsGender,
  CurrentEmploymentStatus__GACUsGender,
  HighestLevelOfEducation__GACUsGender,
  GenderAndCreativityUsDemographicsType,
  Init__GenderAndCreativityUsDemographics,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import { genderAndCreativityUsAssessmentHref } from '../consent'



const href = `${ genderAndCreativityUsAssessmentHref }/spend-time-with-others`
const buttonText = `Next`


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
    genderAndCreativityUsDemographics,
    setGenderAndCreativityUsDemographics
  ] = useState<GenderAndCreativityUsDemographicsType>(
    Init__GenderAndCreativityUsDemographics
  )



  const inputs = [
    {
      onChange: onGenderChange,
      name: 'what-is-your-gender',
      legend: `What is your gender?`,
      inputLabels: getInputLabels(Gender__GACUsGender),
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
      inputLabels: getInputLabels(MaritalStatus__GACUsGender),
    },
    {
      onChange: onCurrentEmploymentStatusChange,
      name: 'current-employment-status',
      legend: `Which statement best describes your current employment status?`,
      inputLabels: getInputLabels(CurrentEmploymentStatus__GACUsGender),
    },
  ]


  async function handleOnSubmit(e: any) {
    e.preventDefault()

    const DEMOGRAPHICS: GenderAndCreativityUsDemographicsType = {
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

    /**
     * @todo Store `DEMOGRAPHICS` in a React context so that it persists to the
     * next page and will be used once the user completes every question-page 
     * of this assessment.
     */
    setGenderAndCreativityUsDemographics(DEMOGRAPHICS)
    
    // Route user to the next page in the list of question-pages for this 
    // assessment
    router.push(href)
  }




  return (
    <>
      <div>
        <form
          onSubmit={ (e: any) => handleOnSubmit(e) }
        >
          <InputWrapper 
            label={ `What is your age?` }
            input={ 
              <TextOrNumberInput  
                name={ 'age' } 
                onChange={ onAgeChange }
                controls={{ type: 'number' }}
                style={{
                  border: '1px solid gray',
                  outline: 'none',
                }}
              /> 
            }
            options={{
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
            }}
          />        
          
          { inputs.map((input, i: number) => (
            <Fragment key={ `gender-and-creativity-us-demographics-radio-or-checkbox-inputs-${ i }` }>
              <RadioOrCheckboxInput
                style={ checkboxStyle }
                legend={ input.legend }
                inputName={ input.name }
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
            label={ `What is your family size? (including yourself, in numbers only)` }
            input={
              <TextOrNumberInput
                name={ 'family-size' }
                controls={{ type: 'number' }}
                onChange={ onFamilySizeChange }
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
            options={ {
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
            } }
          />  

          <RadioOrCheckboxInput
            style={ checkboxStyle }
            legend={ `What is your religion?` }
            inputName={ 'what-is-your-religion' }
            onChange={ onReligionChange }
            inputLabels={ getInputLabels(Religion) }
            options={ { isVertical: true } }
          />
          
          <RadioOrCheckboxInput
            style={ checkboxStyle }
            options={ { isVertical: true } }
            inputName={ 'highest-level-of-education-completed' }
            onChange={ onHighestEducationLevelChange }
            inputLabels={ getInputLabels(HighestLevelOfEducation__GACUsGender) }
            legend={ 
              `What is the highest level of school you have completed or the highest degree you have received?` 
            }
          />
          
          
          <InputWrapper
            label={ `What area of science are you trained in?` }
            input={
              <TextOrNumberInput
                name={ 'area-of-science-trained-in' }
                onChange={ onAreaOfScienceTrainingChange }
                controls={{ type: 'text' }}
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
            options={ {
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
            } }
          />  

          
          <InputWrapper
            label={ `Please indicate your entire annual household income (average) before taxes:` }
            input={
              <TextOrNumberInput
                onChange={ onAnnualHouseholdIncomeChange }
                name={ 'annual-household-income-before-taxes' }
                controls={{ type: 'number' }}
                style={ {
                  border: '1px solid gray',
                  outline: 'none',
                } }
              />
            }
            options={ {
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
            } }
          />

          <div style={ { float: 'right' } }>
            <button 
              type={ `submit` }
              className={ styles.button } 
              style={ { width: '80px' } }
            >
              { buttonText }
            </button>
          </div>

        </form>
      </div>
    </>
  )
}


export default DemographicsForm
