// Externals
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
// Utils
import {
  getInputLabels,
  radioOrCheckboxInputStyle,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { RadioOrCheckboxInput } from '@/components/Input'



const BUTTON_TEXT = `Next`



type CreativityAndAchievementsFormProps = {
  href: string
  pageTitle: string
  pageFragmentId: string
  activityBankId: string
  onSubmit: (e: any) => void
  onChange: {
    onActivityChange: (e: any) => void
    onEngagementLevelChange: (e: any) => void
  }
}



const CreativityAndAchievementsForm: FC<CreativityAndAchievementsFormProps> = ({
  href,
  onSubmit,
  onChange,
  pageTitle,
  pageFragmentId,
  activityBankId,
}) => {
  // React states
  const [ fontSize, setFontSize ] = useState<string>('13px')
  const [ isVertical, setIsVertical ] = useState<boolean>(false)


  const QUESTION_TITLE = (): string => `For each activity in the domain of ${pageFragmentId}, please indicate how often you have carried out this activity over the past 10 years. Mark the applicable button.`
  const QUESTION_LEVEL_OF_ACHIEVEMENT_TITLE = (): string => ` Please mark all levels of achievement that you have attained in the domain of ${pageFragmentId}`
  const QUESTION_YEARS_OF_ENGAGEMENT_TITLE = (): string => `Please state for how many years of your life (approximately) you have been engaged in the domain of ${pageFragmentId}`



  // Function to update question body vertical option size based on window width
  const updateQuestionBodyDisplay = () => {
    const width = window.innerWidth
    const innerWidth = 780
    setIsVertical(width < innerWidth ? true : false)
  }

  

  // Update font size on component mount and window resize
  useLayoutEffect(() => {
    updateQuestionBodyDisplay()
    window.addEventListener('resize', updateQuestionBodyDisplay)

    return () => {
      window.removeEventListener('resize', updateQuestionBodyDisplay)
    }
  }, [])



  return (
    <>
      <div className={ styles.assessmentWrapper }>

        <h3>{ pageTitle }</h3>

        <form
          onSubmit={ onSubmit }
        >

          <div>
            { QUESTION_TITLE() }
          </div>

          <div style={ { margin: '48px 0px 48px 0px' } }>
            { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK[activityBankId].map(
              (question: string, i: number) => (
                <Fragment
                  key={
                    `${ GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE }-${ pageFragmentId }-activity-item-${i}`
                  }
                >
                  <RadioOrCheckboxInput
                    legend={ question }
                    inputName={ question }
                    options={{ isVertical: isVertical }}
                    onChange={ (e: any) => onChange.onActivityChange(e) }
                    style={ radioOrCheckboxInputStyle(isVertical, fontSize) }
                    inputLabels={
                      getInputLabels(
                        undefined,
                        {
                          input: GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND[activityBankId]
                        }
                      )
                    }
                  />
                </Fragment>
              ))
            }
          </div>


            
          <div style={ { margin: '48px 0px 48px 0px' } }>
            <p style={{ margin: '12px 0px 12px 0px' }}>
              { QUESTION_LEVEL_OF_ACHIEVEMENT_TITLE() }
            </p>

            { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK.engagementLevels.map(
              (engagementLevel: string, i: number) => (
                <Fragment
                  key={
                    `${ GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE }-${ pageFragmentId }-engagement-level-item-${i}`
                  }
                >
                  {/* <RadioOrCheckboxInput
                    legend={ engagementLevel }
                    inputName={ engagementLevel }
                    options={{ isVertical: true, type: 'checkbox' }}
                    onChange={ onChange.onEngagementLevelChange }
                    style={ radioOrCheckboxInputStyle(true, fontSize) }
                    inputLabels={
                      getInputLabels(
                        undefined,
                        {
                          input: GENDER_AND_CREATIVITY_US_ACTIVITY_BANK.engagementLevels
                        }
                      )
                    }
                  /> */}

                  <div
                    style={{
                      fontSize: '15px',
                      marginBottom: '8px',
                      borderRadius: '3rem',
                      background: 'rgba(0,0,0,.06)',
                    }}
                  >
                    <label
                      className={ styles.radioButtonLabel }
                      style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: '12px',
                      }}
                    >
                      <input
                        value={ i }
                        type={ 'checkbox' }
                        name={ engagementLevel }
                        className={ styles.radioButtonInput }
                        onChange={ 
                          (e: any) => onChange.onEngagementLevelChange(e)
                        }
                        id={ `${ GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE }-creativity-and-achievements-engagement-level-${ i }` }
                        style={{
                          display: 'flex',
                          marginRight: '24px',
                          top: `0px`,
                          left: `10px`,
                        }}
                        />

                        { engagementLevel }
                    </label>
                  </div>

                </Fragment>
              ))
            }
          </div>

          <div>
            <p>{ QUESTION_YEARS_OF_ENGAGEMENT_TITLE() }</p>
            {/* <TextOrNumberInput

            /> */}
          </div>

          <div style={ { float: 'right' } }>
            <button className={ styles.button } style={ { width: '80px' } }>
              { BUTTON_TEXT }
            </button>
          </div>

        </form>
      </div>
    </>
  )
}


export default CreativityAndAchievementsForm