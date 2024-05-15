// Externals
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import FormButton from '@/components/Buttons/Form'
import Spinner from '@/components/Suspense/Spinner'
import Questionnaire from '@/components/Questionnaire'
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
import { definitelyCenteredStyle } from '@/theme/styles'



const BUTTON_TEXT = `Next`



type CreativityAndAchievementsFormProps = {
  href: string
  pageTitle: string
  isLoading: boolean
  pageFragmentId: string
  questionnaire: {
    choices: string[]
    questions: string[]
    currentQuestionIndex: number
  }
  onSubmit: (e: any) => void
  onChange: {
    onYearsEngagedInChange: (e: any) => void
    onEngagementLevelChange: (e: any) => void
    onActivityChange: (e: any, questionIndex: number) => void
  }
}


type EngagementLevelAndYearsEngagedFormsProps = {
  isLoading: boolean
  pageFragmentId: string
  yearsOfEngagementText: string
  levelOfAchievementText: string
  fragmentKey: {
    getEngagementFragmentKey: (i: number) => string
    getEngagementLevelInputFragmentKey: (i: number) => string
  }
  onChange: {
    onYearsEngagedInChange: (e: any) => void
    onEngagementLevelChange: (e: any) => void
  }
}



const EngagementLevelAndYearsEngagedForms: FC<EngagementLevelAndYearsEngagedFormsProps> = ({
  onChange,
  isLoading,
  fragmentKey,
  pageFragmentId,
  yearsOfEngagementText,
  levelOfAchievementText,
}) => {
  return (
    <>
      <div style={ { margin: '48px 0px 48px 0px' } }>
        <p style={ { margin: '12px 0px 12px 0px' } }>
          { levelOfAchievementText }
        </p>

        { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK.engagementLevels.map(
          (engagementLevel: string, i: number) => (
            <Fragment key={ fragmentKey.getEngagementFragmentKey(i) }>
              <div
                style={ {
                  fontSize: '15px',
                  marginBottom: '8px',
                  borderRadius: '3rem',
                  background: 'rgba(0,0,0,.06)',
                } }
              >
                <label
                  className={ styles.radioButtonLabel }
                  style={ {
                    display: 'flex',
                    width: '100%',
                    marginBottom: '12px',
                  } }
                >
                  <input
                    value={ i }
                    type={ 'checkbox' }
                    name={ engagementLevel }
                    className={ styles.radioButtonInput }
                    id={ fragmentKey.getEngagementLevelInputFragmentKey(i) }
                    onChange={ (e: any) => onChange.onEngagementLevelChange(e) }
                    style={ {
                      display: 'flex',
                      marginRight: '24px',
                      top: `0px`,
                      left: `10px`,
                    } }
                  />
                  { engagementLevel }
                </label>
              </div>

            </Fragment>
          ))
        }
      </div>

      <div
        style={ {
          display: 'flex',
          marginBottom: '48px',
          justifyContent: 'space-between',
        } }
      >
        <p>{ yearsOfEngagementText }</p>
        <TextOrNumberInput
          controls={ { type: 'number' } }
          name={ `years-engaged-${pageFragmentId}` }
          onChange={ onChange.onYearsEngagedInChange }
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
    </>
  )
}





const CreativityAndAchievementsForm: FC<CreativityAndAchievementsFormProps> = ({
  href,
  onChange,
  onSubmit,
  isLoading,
  pageTitle,
  questionnaire,
  pageFragmentId,
}) => {
  // React states
  const [
    isEndOfQuestionnaire,
    setIsEndOfQuestionnaire
  ] = useState<boolean>(false)
  const [ fontSize, setFontSize ] = useState<string>('13px')
  const [ isVertical, setIsVertical ] = useState<boolean>(false)
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0)


  const QUESTION_TEXT = (): string => `For each activity in the domain of ${pageFragmentId}, please indicate how often you have carried out this activity over the past 10 years. Mark the applicable button.`
  const QUESTION_LEVEL_OF_ACHIEVEMENT_TEXT = (): string => ` Please mark all levels of achievement that you have attained in the domain of ${pageFragmentId}`
  const QUESTION_YEARS_OF_ENGAGEMENT_TEXT = (): string => `Please state for how many years of your life (approximately) you have been engaged in the domain of ${pageFragmentId}`


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
            { QUESTION_TEXT() }
          </div>

          <div style={ { margin: '48px 0px 48px 0px' } }>
            <Questionnaire
              choices={ questionnaire.choices }
              questions={ questionnaire.questions }
              onChange={ onChange.onActivityChange }
              setIsEndOfQuestionnaire={ setIsEndOfQuestionnaire }
              currentQuestionIndex={ questionnaire.currentQuestionIndex }
            />

            { isEndOfQuestionnaire && (
              <>
                <EngagementLevelAndYearsEngagedForms
                  isLoading={ isLoading }
                  pageFragmentId={ pageFragmentId }
                  yearsOfEngagementText={ QUESTION_LEVEL_OF_ACHIEVEMENT_TEXT() }
                  levelOfAchievementText={ QUESTION_YEARS_OF_ENGAGEMENT_TEXT() }
                  fragmentKey={{
                    getEngagementFragmentKey,
                    getEngagementLevelInputFragmentKey
                  }}
                  onChange={{
                    onYearsEngagedInChange: onChange.onYearsEngagedInChange,
                    onEngagementLevelChange: onChange.onEngagementLevelChange,
                  }}
                />
              </>
            ) }
          </div>

        </form>
      </div>
    </>
  )
}


export default CreativityAndAchievementsForm