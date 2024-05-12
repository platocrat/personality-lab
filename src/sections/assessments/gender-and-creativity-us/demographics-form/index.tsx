'use client'

// Externals
import { useState } from 'react'
// Locals
import NumberInput from '@/components/Input/Number'
import InputWrapper from '@/components/Input/Wrapper'
import { RadioOrCheckboxInput } from '@/components/Input'
// Utils
import { Gender__GACUsGender, RaceOrEthnicity } from '@/utils'
import { getInputLabels } from '@/utils/gender-and-creativity-us'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/app/page.module.css'




const DemographicsForm = ({ }) => {
  // States
  const [
    raceOrEthnicity,
    setRaceOrEthnicity
  ] = useState<RaceOrEthnicity[]>( [ RaceOrEthnicity.WhiteCaucasian ] )
  const [ age, setAge ] = useState<number>(0)
  const [ gender, setGender ] = useState<string>(Gender__GACUsGender.Male)


  const onAgeChange = (e: any) => {
    const age = e.target.value
    setAge(age)
  }
  
  function onGenderChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value
    setGender(value)
  } 
  
  function onRaceOrEthnicityChange(e: any) {
    // console.log(`e.target.value: `, e.target.value)
    const value = e.target.value

    setRaceOrEthnicity((prevCheckedItems) => {
      if (prevCheckedItems.includes(value)) {
        return prevCheckedItems.filter((item) => item !== value);
      } else {
        return [...prevCheckedItems, value];
      }
    })
  } 





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
