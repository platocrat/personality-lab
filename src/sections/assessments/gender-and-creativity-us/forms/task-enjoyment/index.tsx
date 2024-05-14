// Externals
import { useRouter } from 'next/router'
import { FC, Fragment, useLayoutEffect, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import { 
  GENDER_AND_CREATIVITY_US_ACTIVITY_BANK, 
  GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF, 
  GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES 
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/farewell-contact-info`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `task enjoyment`



type TaskEnjoymentFormProps = {
  pageFragmentId: string
}



const QUESTION_TITLE = ` This final part of the survey asks about your interests.Below is a list of tasks.For each task, please select a response to indicate how much you would enjoy performing that task.`




const TaskEnjoymentForm: FC<TaskEnjoymentFormProps> = ({
  pageFragmentId
}) => {
  // Hooks
  const router = useRouter()

  const [userResponses, setUserResponses] = useState<any>({})
  const [ taskEnjoyments, setTaskEnjoyments ] = useState<any>({})


  const FRAGMENT_KEY_PREFACE = GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACES(
    pageFragmentId
  )

  const getFragmentKey = (i: number): string => `${FRAGMENT_KEY_PREFACE}-${i}`


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

    setUserResponses(taskEnjoyments)

    await storeResponsesInLocalStorage(userResponses)

    // Use router to route the user to the assessment page
    router.push(href)
  }


  async function storeResponsesInLocalStorage(userResponses) {
    const key = FRAGMENT_KEY_PREFACE
    const value = JSON.stringify(userResponses)
    localStorage.setItem(key, value)
  }


  // Test that data is being stored
  useLayoutEffect(() => {
    console.log(`${FRAGMENT_KEY_PREFACE}: userResponses: `, userResponses)
  }, [userResponses])




  return (
    <>
      <form
        className={ styles.assessmentWrapper }
        onSubmit={ (e: any) => handleOnSubmit(e) }
      >

        <div>
          <p>
            {  }
          </p>
        </div>

        <div>
          { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK.taskEnjoyment.map(
            (taskEnjoyment: string, i: number) => (
              <Fragment key={ getFragmentKey(i) }>
                <TextOrNumberInput
                  name={ taskEnjoyment }
                  onChange={ 
                    (e: any) => onTaskEnjoymentChange(e, taskEnjoyment) 
                  }
                />
              </Fragment>
            )) 
          }
        </div>

        <div style={ { float: 'right' } }>
          <button className={ styles.button } style={ { width: '80px' } }>
            { BUTTON_TEXT }
          </button>
        </div>

      </form>
    </>
  )
}


export default TaskEnjoymentForm