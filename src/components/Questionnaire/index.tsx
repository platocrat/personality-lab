// Externals
import { Fragment, useState } from 'react'
// Locals
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type QuestionnaireProps = {
  choices: string[]
  questions: string[]
  // onSubmit: (e: any) => void
}




const Questionnaire = ({ 
  choices,
  // onSubmit,
  questions, 
}) => {
  const [ userResponses, setUserResponses ] = useState({})
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0)
  

  const onChange = (e: any, questionIndex: number) => {
    const { value } = e.target

    setUserResponses({
      ...userResponses,
      [questionIndex]: value
    })
    
    // Move to the next question after a short delay
    if (questionIndex < questions.length - 1) {
      const timeout = 28 // 300ms delay for the transition effect

      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1);
      }, timeout)
    }
  }
  


  return (
    <div className={ styles.assessmentWrapper }>
      <form
        // onSubmit={ (e: any) => onSubmit(e) }
      >
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
            <h3>{ question }</h3>

            <div
              style={{ 
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              { choices.map((choice: string, j: number) => (
                <Fragment key={ j }>
                  <div 
                    style={{ 
                      width: '100%',
                      height: '120px',
                    }}
                  >
                    <div
                      style={{
                        ...definitelyCenteredStyle,
                        height: '72px',
                        textAlign: 'center',
                        padding: '0px 4.25px'
                      }}
                    >
                      <p>
                        { choice }
                      </p>
                    </div>
                    <div 
                      // className={ styles.radioButtonWrapper }
                      style={{
                        ...definitelyCenteredStyle,
                        height: '28px',
                        width: '100%',
                      }}
                    >
                      <label 
                        htmlFor={ `choice-${ j }` }
                        className={ styles.radioButtonLabel }
                        style={ {
                          ...definitelyCenteredStyle,
                          flexDirection: 'row',
                          width: '100%',
                        } }
                      >
                        <input
                          type='radio'
                          value={ choice }
                          id={ `choice-${ j }` }
                          className={ styles.radioButtonInput }
                          name={ `question-${currentQuestionIndex}` }
                          checked={ userResponses[currentQuestionIndex] === choice }
                          onChange={ (e) => onChange(e, currentQuestionIndex) }
                          style={{
                            top: '-1px',
                            left: '11px',
                            right: '0px',
                            height: '48px',
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </Fragment>
              )) }
            </div>

          </div>
        )) }
      </form>


      {/* Display the user's responses */}
      <pre>{JSON.stringify(userResponses, null, 2)}</pre>

    </div>
  )
}


export default Questionnaire