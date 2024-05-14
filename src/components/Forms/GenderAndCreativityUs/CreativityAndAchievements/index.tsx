// Externals
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
import TextOrNumberInput from '@/components/Input/TextOrNumber'
// Utils
import {
  getInputLabels,
  radioOrCheckboxInputStyle,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import Spinner from '@/components/Suspense/Spinner'
import { definitelyCenteredStyle } from '@/theme/styles'



const BUTTON_TEXT = `Next`



type CreativityAndAchievementsFormProps = {
  href: string
  pageTitle: string
  isLoading: boolean
  pageFragmentId: string
  activityBankId: string
  onSubmit: (e: any) => void
  onChange: {
    onActivityChange: (e: any) => void
    onYearsEngagedInChange: (e: any) => void
    onEngagementLevelChange: (e: any) => void
  }
}



const CreativityAndAchievementsForm: FC<CreativityAndAchievementsFormProps> = ({
  href,
  onChange,
  onSubmit,
  isLoading,
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


  const FRAGMENT_KEY_PREFACE = GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )

  const getActivityFragmentKey = (
    i: number
  ): string => `${FRAGMENT_KEY_PREFACE}--activity-item-${i}`
  
  const getEngagementFragmentKey = (
    i: number
  ): string => `${FRAGMENT_KEY_PREFACE}--engagement-level-${i}`

  const getEngagementLevelInputFragmentKey = (
    i: number
  ): string => `${FRAGMENT_KEY_PREFACE}--engagement-level-${i}--input`


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

        <h3 style={{ marginBottom: '12px' }}>{ pageTitle }</h3>

        <form
          onSubmit={ (e: any) => onSubmit(e) }
        >

          <div>
            { QUESTION_TITLE() }
          </div>

          <div style={ { margin: '48px 0px 48px 0px' } }>
            { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK[activityBankId].map(
              (question: string, i: number) => (
                <Fragment key={ getActivityFragmentKey(i) }>
                  <RadioOrCheckboxInput
                    legend={ question }
                    inputName={ question }
                    options={{ isVertical: isVertical }}
                    onChange={ onChange.onActivityChange }
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
                <Fragment key={ getEngagementFragmentKey(i) }>
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
                        id={ getEngagementLevelInputFragmentKey(i) }
                        className={ styles.radioButtonInput }
                        onChange={ (e: any) => onChange.onEngagementLevelChange(e) }
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

          <div
            style={{ 
              display: 'flex',  
              marginBottom: '48px',
              justifyContent: 'space-between',
            }}
          >
            <p>{ QUESTION_YEARS_OF_ENGAGEMENT_TITLE() }</p>
            <TextOrNumberInput
              controls={{ type: 'number' }}
              onChange={ onChange.onYearsEngagedInChange }
              name={ `years-engaged-${ pageFragmentId }` }
            />
          </div>

          { isLoading 
            ? (
              <>
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    position: 'relative',
                    top: '80px',
                  } }
                >
                  <Spinner height='40' width='40' />
                </div>  
              </>
            )
            : (
              <>
                <div style={ { float: 'right' } }>
                  <button className={ styles.button } style={ { width: '80px' } }>
                    { BUTTON_TEXT }
                  </button>
                </div>
              </>
            )
          }

        </form>
      </div>
    </>
  )
}


export default CreativityAndAchievementsForm