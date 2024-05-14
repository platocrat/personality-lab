'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import { RadioOrCheckboxInput } from '@/components/Input'
import {
  getInputLabels,
  radioOrCheckboxInputStyle,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK,
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF,
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE,
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/instructions`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `level-of-agreement`
const QUESTION_TITLE = `Please indicate your level of agreement to the following statements using the options provided`



type LevelOfAgreementFormProps = {}




const LevelOfAgreementForm: FC<LevelOfAgreementFormProps> = ({ }) => {
  // Hooks
  const router = useRouter()

  // React states
  const [fontSize, setFontSize] = useState<string>('13px')
  const [isVertical, setIsVertical] = useState<boolean>(false)
  const [
    levelOfAgreementResponses,
    setLevelOfAgreementResponses
  ] = useState<any>({

  })



  const onLevelOfAgreementChange = (e: any) => {
    const { name, value } = e.target

    setLevelOfAgreementResponses({
      ...levelOfAgreementResponses,
      [`${name}`]: value
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

    // await storeResponsesInDynamoDB(levelOfAgreementResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  /**
   * @todo INCOMPLETE
   */
  async function storeResponsesInDynamoDB(
    levelOfAgreementResponses
  ) {
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
      const userResults: GenderAndCreativityUs__LevelOfAgreementResults__DynamoDB = {
        email: email,
        timestamp: CURRENT_TIMESTAMP,
        levelOfAgreementResponses: levelOfAgreementResponses,
      }

      try {
        const response = await fetch('/bessi/assessment/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ levelOfAgreementResponses }),
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

            <div style={ { margin: '48px 0px 48px 0px' } }>
              { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK.levelOfAgreement.map(
                (question: string, i: number) => (
                  <Fragment
                    key={
                      `${GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE}-${PAGE_FRAGMENT_ID}-question-item-${i}`
                    }
                  >
                    <RadioOrCheckboxInput
                      legend={ question }
                      options={ { isVertical: isVertical } }
                      onChange={ onLevelOfAgreementChange }
                      inputName={ question }
                      inputLabels={
                        getInputLabels(
                          undefined,
                          {
                            input: GENDER_AND_CREATIVITY_US_ACTIVITY_BANK_LEGEND.levelOfAgreement
                          }
                        )
                      }
                      style={ radioOrCheckboxInputStyle(isVertical, fontSize) }
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


export default LevelOfAgreementForm