'use client'

// Externals
import { useState } from 'react'
// Locals
import { BubbleRadioInput } from '@/components/Input/Radio'



const genderInputLabels = [
  { id: 'male', name: `Male` },
  { id: 'female', name: `Female` },
  { id: 'agender', name: `Agender` },
  { id: 'nonbinary', name: `Nonbinary` },
  { id: 'gender-fuid', name: `Gender Fluid` },
  { id: 'other', name: `Other` },
]



const DemographicsForm = ({ }) => {
  const [ gender, setGender ] = useState<string>('')


  const handleOnGenderChange = (e: any, i: number) => {

  }



  return (
    <>
      <div>What is your age?</div>
      <input type='number' />
      
      <div>
        What is your gender?
      </div>

      <BubbleRadioInput 
        legend={ `What is your gender?` }
        // options={  }
        onChange={ handleOnGenderChange }
        inputName={ 'what-is-your-gender' }
        // itemIndex={  }
        inputLabels={ genderInputLabels }
      />


      <div>
        Please choose one or more races that you consider yourself to be:
      </div>

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

    </>
  )
}



