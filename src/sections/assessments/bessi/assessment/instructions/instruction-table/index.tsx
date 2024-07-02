// Externals
import { Fragment } from 'react'
// Locals
import { WELLNESS_RATINGS, WELLNESS_RATINGS_DESCRIPTIONS } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const InstructionTable = () => {
  return (
    <>
      <div className={ styles.bessi_instruction_table_wrapper }>
        <table className={ styles.bessi_instruction_table_body }>
          <tbody className={ styles.bessi_instruction_tbody }>
            <tr className={ styles.bessi_instruction_tr }>
              { WELLNESS_RATINGS.map((rating: number, i: number) => (
                <Fragment key={ `wellness-rating-${i}` }>
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
              { WELLNESS_RATINGS_DESCRIPTIONS.map((description: string, i: number) => (
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


export default InstructionTable