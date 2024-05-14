// Externals
import { FC, Fragment, useState } from 'react'
// Locals
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import { GENDER_AND_CREATIVITY_US_ACTIVITY_BANK, GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF, GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE } from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import TextOrNumberInput from '@/components/Input/TextOrNumber'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/farewell-contact-info`

const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `task enjoyment`



type TaskEnjoymentFormProps = {}



const QUESTION_TITLE = ` This final part of the survey asks about your interests.Below is a list of tasks.For each task, please select a response to indicate how much you would enjoy performing that task.`




const TaskEnjoymentForm: FC<TaskEnjoymentFormProps> = ({ }) => {
  const [ taskEnjoyments, setTaskEnjoyments ] = useState<any>({})


  const onTaskEnjoymentChange = (e: any, taskEnjoyment: string) => {
    const _ = e.target.value

    setTaskEnjoyments({
      ...taskEnjoyments,
      [`${ taskEnjoyment }`]: _
    })
  }
  

  async function handleOnSubmit(e: any) {
    e.preventDefault()


  }




  return (
    <>
      <div>
        <form
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
                <Fragment
                  key={ `${ GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE }-task-enjoyment-${ i }` }
                >
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
            <button
              type={ `submit` }
              className={ styles.button }
              style={ { width: '80px' } }
            >
              { BUTTON_TEXT }
            </button>
          </div>

        </form>
      </div>
    </>
  )
}


export default TaskEnjoymentForm