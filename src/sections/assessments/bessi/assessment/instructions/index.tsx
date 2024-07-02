// Externals
import { Fragment } from 'react'
// Locals
import { 
  WELLNESS_RATINGS, 
  WELLNESS_RATING_DESCRIPTIONS
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const BessiAssessmentInstructions = () => {
  return (
    <>
      <div
        /**
         * @dev Used `assessmentSubtitle` className for a consistent 
         * font-size.
         */
        className={ styles.assessmentSubtitle }
        style={ { margin: '20px 0px' } }
      >
        <h4>{ `Instructions` }</h4>
        <p>
          {
            `Here is a list of activities or things you could do. For each one, please select a response to indicate `
          } 
          <strong>
            <em>{ `how well` }</em>
          </strong>
          {
            ` you can do that thing. For example, how well can you follow the instructions for an assignment? Note that how well you can do something may be different from how often you do it, or how much you like to do it. For each activity, you should rate ` 
          }
          <strong>
            <em>{ `how well` }</em>
          </strong>
          { ` you can do that thing.` }
        </p>
      </div>
      <br />
    </>
  )
}


export default BessiAssessmentInstructions