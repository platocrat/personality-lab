'use client'

// Externals
import { useContext, useState } from 'react'
// Locals
import NumberInput from '@/components/Input/Number'
import InputWrapper from '@/components/Input/Wrapper'
import { RadioOrCheckboxInput } from '@/components/Input'
// Contexts
import { UserDemographicContext } from '@/contexts/UserDemographicContext'
// Utils
import { 
  getInputLabels,
  RaceOrEthnicity,
  Gender__GACUsGender,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'




const DemographicsForm = ({ }) => {
  // Contexts
  const {
    onAgeChange,
    onGenderChange,
    onRaceOrEthnicityChange,
  } = useContext(UserDemographicContext)



  return (
    <>
      <div>
        <InputWrapper 
          label={ `What is your age?` }
          input={ 
            <NumberInput  
              name={ 'age' } 
              style={{
                border: '1px solid gray',
                outline: 'none',
              }}
              onChange={ onAgeChange }
            /> 
          }
          options={{
            splitLabelAndInput: true,
            css: {
              splitInput: {
                marginLeft: '25%',
              }
            },
            classNames: {
              pClassName: styles.inputWrapperP,
              spanClassName: styles.inputWrapperSpan,
            }
          }}
        />
        
        
        <RadioOrCheckboxInput
          legend={ `What is your gender?` }
          options={{ isVertical: true }}
          onChange={ onGenderChange }
          inputName={ 'what-is-your-gender' }
          // itemIndex={  }
          inputLabels={ getInputLabels(Gender__GACUsGender) }
          style={{
            outerWrapper: { 
              ...definitelyCenteredStyle,
            },
            questionBodyStyle: {
              ...definitelyCenteredStyle,
              width: '60%',
              maxWidth: '500px'
            },
            radioButtonLabelStyle: {
              padding: '8px 18px',
            },
            radioButtonInputStyle: {
              top: '0px',
            },
          }}
        />


        <RadioOrCheckboxInput
          options={ { 
            type: 'checkbox',
            isVertical: true,
          } }
          onChange={ onRaceOrEthnicityChange }
          inputName={ 'select-race-or-ethnicity' }
          // itemIndex={  }
          inputLabels={ getInputLabels(RaceOrEthnicity) }
          legend={ `Please choose one or more races that you consider yourself to be:` }
          style={ {
            outerWrapper: {
              ...definitelyCenteredStyle,
            },
            questionBodyStyle: {
              ...definitelyCenteredStyle,
              width: '60%',
              maxWidth: '500px'
            },
            radioButtonLabelStyle: {
              padding: '8px 18px',
            },
            radioButtonInputStyle: {
              top: '0px',
            },
          } }
        />

        <div>
          White
          Black or African American
          American Indian or Alaska Native
          Asian
          Native Hawaiian or Pacific Islander
          Other
        </div>

        <div>
          What is your marital status?
        </div>
        <div>
          Married
          Widowed
          Divorced
          Separated
          Never Married
          Other
        </div>
        
        <div>
          Which statement best describes your current employment status?
        </div>
        <div>
          Working (paid employee)
          Working (self-employed)
          Not working (temporary layoff from a job)
          Not working (looking for work)
          Not working (retired)
          Not working (disabled)
          Not working (other)
          Prefer not to answer
        </div>
        <div>
          What is your family size? (including yourself, in numbers only)
        </div>

        <div>
          What is your religion?
        </div>
        <input type='number' />

        <div>
          What is the highest level of school you have completed or the highest degree you have received?
        </div>
        <div>
          Less than high school degree
          High school graduate (high school diploma or equivalent including GED)
          Some college but no degree
          Associate degree in college (2-year)
          Bachelor's degree in college (4-year)
          Master's degree
          Doctoral degree
          Professional degree (JD, MD)
        </div>
        
        <div>
          What area of science are you trained in?
        </div>
        <input type='text'/>
        
        <div>
          Please indicate your entire annual household income (average) before taxes:
        </div>
        <input type='number' />
      </div>
    </>
  )
}


export default DemographicsForm
