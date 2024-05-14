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



type GeneralActivitiesProps = {
  href: string
  buttonText: string
  questionTitle: string
  pageFragmentId: string
  activityBankId: string
}




const GeneralActivities: FC<GeneralActivitiesProps> = ({
  href,
  buttonText,
  questionTitle,
  pageFragmentId,
  activityBankId,
}) => {
  // Hooks
  const router = useRouter()

  // React states
  const [fontSize, setFontSize] = useState<string>('13px')
  const [isVertical, setIsVertical] = useState<boolean>(false)
  const [userResponses, setUserResponses] = useState<any>({})



  const onChange = (e: any) => {
    const { name, value } = e.target
    setUserResponses({ ...userResponses, [`${name}`]: value })
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

    setUserResponses(userResponses)

    await storeResponsesInLocalStorage(userResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    localStorage.setItem(pageFragmentId, JSON.stringify(userResponses))
  }



  // Update font size on component mount and window resize
  useLayoutEffect(() => {
    updateQuestionBodyDisplay()
    window.addEventListener('resize', updateQuestionBodyDisplay)

    return () => {
      window.removeEventListener('resize', updateQuestionBodyDisplay)
    }
  }, [])


  // Test that data is being stored
  useLayoutEffect(() => {
    console.log(`${pageFragmentId} userResponses: `, userResponses)
  }, [userResponses])




  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <table>
          <tbody>

            <div>
              { questionTitle }
            </div>

            <div style={ { margin: '48px 0px 48px 0px' } }>
              { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK[activityBankId].map(
                (question: string, i: number) => (
                  <Fragment
                    key={
                      `${GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE}-${pageFragmentId}-question-item-${i}`
                    }
                  >
                    <RadioOrCheckboxInput
                      legend={ question }
                      onChange={ onChange }
                      inputName={ question }
                      options={ { isVertical: isVertical } }
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

          </tbody>
        </table>

        <div style={ { float: 'right' } }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { buttonText }
          </button>
        </div>

      </form>
    </>
  )
}


export default GeneralActivities