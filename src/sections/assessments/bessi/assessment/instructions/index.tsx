'use client';

// Externals
import { Fragment } from 'react'
// Locals
import { 
  wellnessRatings, 
  wellnessRatingDescriptions
} from '@/utils/bessi/constants'
// CSS
import styles from '@/app/page.module.css'



const InstructionTable = () => {
  return (
    <>
      <div className={ styles.bessi_instruction_table_wrapper }>
        <table className={ styles.bessi_instruction_table_body }>
          <tbody className={ styles.bessi_instruction_tbody }>
            <tr className={ styles.bessi_instruction_tr }>
              { wellnessRatings.map((rating: number, i: number) => (
                <Fragment key={`wellness-rating-${i}`}>
                  <th className={ styles.bessi_instruction_th }>
                    <p className={ styles.bessi_instruction_p }>
                      <span className={ styles.bessi_instruction_text1 }>
                        <strong>{ rating }</strong>
                      </span>
                    </p>
                  </th>
                </Fragment>
              )) }
            </tr>
            <tr className={ styles.bessi_tr }>
              { wellnessRatingDescriptions.map(( description: string, i: number) => (
                <Fragment key={ `wellness-rating-description-${i}` }>
                  <td className={ styles.bessi_instruction_td }>
                    <p className={ styles.bessi_instruction_p }>
                      <span className={ styles.bessi_instruction_text1 }>
                        <strong>{ description }</strong>
                      </span>
                    </p>
                  </td>
                </Fragment>
              )) }
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

const BessiAssessmentInstructions = () => {
  return (
    <>
      <div
        /**
         * @dev Used `assessmentSubtitle` className for a consistent 
         * font-size.
         */
        className={ styles.assessmentSubtitle }
        style={ { marginTop: '20px' } }
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
      <InstructionTable />
    </>
  )
}

export default BessiAssessmentInstructions