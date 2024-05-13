'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
import { 
  questionBank, 
  getInputLabels,
  questionBankLegend, 
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE,
  BessiUserResults__DynamoDB,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const href = `${ GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF }/level-of-agreement`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `spend-time-with-others`
const QUESTION_TITLE = `Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are someone who likes to spend time with others? Please indicate the extent to which you agree or disagree with each statement. I am someone who...`



type SpendTimeWithOthersFormProps = { }




const SpendTimeWithOthersForm: FC<SpendTimeWithOthersFormProps> = ({  }) => {
  // Hooks
  const router = useRouter()

  // Initial font size
  const [ fontSize, setFontSize ] = useState<string>('13px')
  const [ isVertical, setIsVertical ] = useState<boolean>(false)

  const [ 
    spendTimeWithOthersResponses, 
    setSpendTimeWithOthersResponses 
  ] = useState<any>({ 

  })



  const onSpendTimeWithOthersChange =(e: any) => {
    const { name, value } = e.target.value 

    setSpendTimeWithOthersResponses({
      ...spendTimeWithOthersResponses,
      [ `${name}` ]: value
    })
  }

  
  // Function to update question body vertical option size based on window width
  const updateQuestionBodyDisplay = () => {
    const width = window.innerWidth
    const innerWidth = 780
    setIsVertical(width < innerWidth ? true : false)
  }


  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()

    await storeResponsesInDynamoDB(spendTimeWithOthersResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }

  /**
   * @todo INCOMPLETE
   */
  async function storeResponsesInDynamoDB(spendTimeWithOthersResponses) {
    const CURRENT_TIMESTAMP = new Date().getTime()

    /**
     * @todo Generalize this function call so that it can be called from 
     * anywhere and NOT just from the `/bessi/assessment/api/aws-parameter`
     */
    const email = await getUserEmailFromCookie()

    if (email === undefined) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error getting email from cookie!`)
    } else {
      /**
       * @dev This is the object that we store in DynamoDB using AWS's 
       * `PutItemCommand` operation.
       */
      const userResults: GenderAndCreativityUs__SpendTimeWithOthersResults__DynamoDB = {
        email: email,
        timestamp: CURRENT_TIMESTAMP,
        spendTimeWithOthersResponses: spendTimeWithOthersResponses,
      }

      try {
        const response = await fetch('/bessi/assessment/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ spendTimeWithOthersResponses }),
        })

        const json = await response.json()

        if (response.status === 200) {
          const userResultsId = json.data
          return userResultsId
        } else {
          const error = `Error posting BESSI results to DynamoDB: `
          /**
           * @todo Handle error UI here
           */
          throw new Error(error, json.error)
        }
      } catch (error: any) {
        /**
         * @todo Handle error UI here
         */
        throw new Error(`Error! `, error)

      }
    }
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
      <form 
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <table>
          <tbody>

            <div>
              { QUESTION_TITLE }
            </div>
            
            <div style={{ margin: '48px 0px 48px 0px' }}>
              { questionBank.spendTimeWithOthers.map(
                  (question: string, i: number) => (
                  <Fragment 
                    key={ 
                      `${ GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE }-${ PAGE_FRAGMENT_ID }-question-item-${ i }` 
                    }
                  >
                    <RadioOrCheckboxInput
                      legend={ question }
                      options={{ isVertical: isVertical }}
                      onChange={ onSpendTimeWithOthersChange }
                      inputName={ question }
                      inputLabels={ 
                        getInputLabels(undefined, { input: questionBankLegend }) 
                      }
                      style={{
                        questionBodyStyle: {
                          ...definitelyCenteredStyle,
                        },
                        radioButtonLabelStyle: {
                          width: '100%',
                          paddingRight: '12px',
                          margin: isVertical ? '12px 0px' : ''
                        },
                        radioButtonInputStyle: {
                          marginRight: '12px',
                          top: `0px`,
                          left: `2px`,
                          height: `24.5px`,
                          width: `14.5px`,
                        },
                        radioButtonText: {
                          fontSize: fontSize,
                        }
                      }}
                    />
                  </Fragment>
                ))
              }
            </div>

          </tbody>
        </table>

        <div style={ { float: 'right' } }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { BUTTON_TEXT }
          </button>
        </div>
        
      </form>
    </>
  )
}


export default SpendTimeWithOthersForm