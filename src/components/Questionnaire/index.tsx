// Externals
import { 
  FC, 
  Dispatch, 
  Fragment,
  useState,
  SetStateAction, 
  useLayoutEffect,
} from 'react'
// Locals
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type QuestionnaireProps = {
  choices: string[]
  questions: string[]
  currentQuestionIndex: number
  onChange: (...args: any[]) => void
  setIsEndOfQuestionnaire: Dispatch<SetStateAction<boolean>>
  controls?: {
    valueType?: 'string' | 'number'
  }
}




const Questionnaire: FC<QuestionnaireProps> = ({ 
  choices,
  onChange,
  controls,
  questions,
  currentQuestionIndex,
  setIsEndOfQuestionnaire,
}) => {  
  useLayoutEffect(() => {
    setIsEndOfQuestionnaire(currentQuestionIndex === questions.length - 1)
  }, [currentQuestionIndex])


  
  return (
    <div style={{ margin: '24px 0px 48px 0px' }}>
      { questions.map((question: string, i: number) => (
        <div
          key={ i }
          className={ 
            `${ styles.questionnaire_question } ${
              currentQuestionIndex === i 
              ? `${ styles.questionnaire_visible }` 
              : `${ styles.questionnaire_hidden }`
            }` 
          }
          style={{ 
            transitionDelay: `${
              currentQuestionIndex === i 
                ? '0s' 
                : '0.3s'
              }`,
          }}
        >
          <h3 style={{ marginBottom: '12px' }}>
            { question }
          </h3>

          <div
            style={{ 
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            { choices.map((choice: string, j: number) => (
              <Fragment key={ j }>
                <div style={{ width: '100%', height: '140px' }}>
                  <div
                    style={{
                      ...definitelyCenteredStyle,
                      height: '72px',
                      textAlign: 'center',
                      padding: '0px 4.25px',
                      marginBottom: '24px',
                    }}
                  >
                    <p>{ choice }</p>
                  </div>
                  <div 
                    style={{
                      ...definitelyCenteredStyle,
                      height: '28px',
                      width: '100%',
                    }}
                  >
                    <input
                      type='radio'
                      id={ `choice-${ j }` }
                      name={ `question-${i}` }
                      className={ styles.radioButtonInput }
                      value={ controls?.valueType === 'number' ? j : choice }
                      onChange={ 
                        (e) => onChange(
                          e,  
                          controls?.valueType === 'number'
                            ? i
                            : currentQuestionIndex
                        ) 
                      }
                      style={{
                        top: '-1px',
                        left: '11px',
                        right: '0px',
                        width: '100%',
                        height: '48px',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
              </Fragment>
            )) }
          </div>
        </div>
      )) }
    </div>
  )
}


export default Questionnaire