'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, Fragment, useEffect, useLayoutEffect, useState } from 'react'
// Locals
import FormButton from '@/components/Buttons/Form'
import { RadioOrCheckboxInput } from '@/components/Input'
import CreativityAndAchievementsForm from '@/components/Forms/BigFive/CreativityAndAchievements'
// Utils
import { 
  getInputLabels,
  BIG_FIVE_PATH,
  BIG_FIVE_ACTIVITY_BANK, 
  BIG_FIVE_ASSESSMENT_HREF, 
  BIG_FIVE_ACTIVITY_BANK_LEGEND,
  BIG_FIVE_FRAGMENT_ID_PREFACES,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `/${BIG_FIVE_PATH}/submit-results`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `task enjoyment`



type TaskEnjoymentFormProps = {
  pageFragmentId: string
}



const QUESTION_TITLE = ` This final part of the survey asks about your interests. Below is a list of tasks. For each task, please select a response to indicate how much you would enjoy performing that task.`




const TaskEnjoymentForm: FC<TaskEnjoymentFormProps> = ({
  pageFragmentId
}) => {
  // Hooks
  const router = useRouter()

  // Boolean states
  const [isVertical, setIsVertical] = useState<boolean>(false)
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
  const [ hasSubmitted, setHasSubmitted ] = useState<boolean>(false)
  // Custom states
  const [ userResponses, setUserResponses ] = useState<any>({})
  const [ taskEnjoyments, setTaskEnjoyments ] = useState<any>({})


  const FRAGMENT_KEY_PREFACE = BIG_FIVE_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )

  const getFragmentKey = (i: number): string => `${FRAGMENT_KEY_PREFACE}-${i}`

  // Function to update question body vertical option size based on window width
  const updateQuestionBodyDisplay = () => {
    const width = window.innerWidth
    const innerWidth = 850
    setIsVertical(width < innerWidth ? true : false)
  }


  const onTaskEnjoymentChange = (e: any, taskEnjoyment: string) => {
    const _ = e.target.value

    setTaskEnjoyments({
      ...taskEnjoyments,
      [`${ taskEnjoyment }`]: _
    })
  }
  

  // ------------------------- Async functions ---------------------------------
  async function handleOnSubmit(e: any) {
    e.preventDefault()
    
    setIsSubmitting(true)
    setUserResponses(taskEnjoyments)
    
    await storeResponsesInLocalStorage(userResponses)
    
    setHasSubmitted(true)
    
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 300)
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
  useEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponses: `, userResponses)
  }, [userResponses])




  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <div 
          style={{ 
            marginBottom: '24px'
          }}
        >
          <p>
            { QUESTION_TITLE }
          </p>
        </div>

        <div>
          { BIG_FIVE_ACTIVITY_BANK.taskEnjoyment.map(
            (taskEnjoyment: string, i: number) => (
              <Fragment key={ getFragmentKey(i) }>
                <RadioOrCheckboxInput
                  legend={ taskEnjoyment }
                  inputName={ taskEnjoyment }
                  options={ { isVertical: isVertical } }
                  style={{
                    questionBodyStyle: {
                      width: '100%',
                    },
                    radioButtonLabelStyle: {
                      paddingRight: '18px',
                    },
                    radioButtonInputStyle: {
                      top: '0px',
                      marginRight: '12px',
                    },
                  }}
                  inputLabels={ 
                    getInputLabels(
                      undefined,
                      {
                        input: BIG_FIVE_ACTIVITY_BANK_LEGEND.taskEnjoyment
                      }
                    )
                   }
                  onChange={ 
                    (e: any) => onTaskEnjoymentChange(e, taskEnjoyment) 
                  }
                />
              </Fragment>
            )) 
          }
        </div>

        <FormButton 
          buttonText={ BUTTON_TEXT }
          state={{
            isSubmitting: isSubmitting,
            hasSubmitted: hasSubmitted,
          }}
        />

      </form>
    </>
  )
}


export default TaskEnjoymentForm