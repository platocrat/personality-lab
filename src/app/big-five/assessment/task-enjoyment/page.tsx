// Externals
import { FC } from 'react'

// Locals
// Sections
import TaskEnjoymentForm from '@/sections/assessments/big-five/forms/task-enjoyment'
// CSS
import styles from '@/app/page.module.css'



type TaskEnjoymentProps = {}


const PAGE_FRAGMENT_ID = `task-enjoyment`



const TaskEnjoyment: FC<TaskEnjoymentProps> = ({ }) => {
  return (
    <>
      <main className={ `${styles.main} ` }>
        <TaskEnjoymentForm pageFragmentId={ PAGE_FRAGMENT_ID } />
      </main>
    </>
  )
}

export default TaskEnjoyment