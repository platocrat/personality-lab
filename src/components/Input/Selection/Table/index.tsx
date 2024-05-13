// Externals
import { FC, Fragment, ReactNode, Dispatch, SetStateAction } from 'react'
// Locals
// Constants
import { 
  wellnessRatings,
  wellnessRatingDescriptions, 
} from '@/utils/assessments/bessi/constants'
// Types
import { InputLabelType } from '../types'
// CSS
import styles from '@/app/page.module.css'



type TableRadioInputProps = {
  items: any[]
  onChange: (e: any, i: number) => void
  options?: {
    isVertical?: boolean
  }
}


const TableRadioInput: FC<TableRadioInputProps> = ({ 
  items,
  options,
  onChange,
}) => {
  function fragmentKey(inputLabel: InputLabelType, i: number): string {
    return `table-radio-input-id${inputLabel.inputId}-${inputLabel.labelName}-${i}` 
  }

  function inputId(obj: any, i: number, j: number): string {
    const prefix = `${i}-${obj.activity}-inputId${i}`
    const suffix = `-itemIndex${i}-index${j}` 
    return prefix + suffix
  }


  return (
    <>
      <table className={ styles.bessi_assessment_table_body }>
        <tbody className={ styles.bessi_assessment_tbody }>
          { items.map(( obj: any, i: number ) => (
            <Fragment key={ `${obj.activity}-${i}` }>
              { i % 24 === 0  ? (
                <>
                  <tr className={ styles.bessi_assessment_tr }>
                    { [...wellnessRatingDescriptions, `Activity.`].map((
                      description: string, 
                      k: number
                    ) => (
                      <Fragment key={ `wellness-rating-description-${k}` }>
                        <th 
                          className={ styles.bessi_assessment_th }
                          style={ { minWidth: k === 5 ? '200px' : '' } }
                        >
                          <p className={ styles.bessi_assessment_p }>
                            { description }
                          </p>
                        </th>
                      </Fragment>
                    )) }
                  </tr>
                </>
              ) : null }

              <tr className={ styles.bessi_assessment_tr }>
                { [...wellnessRatings, 6].map((
                  rating: number, 
                  j: number
                ) => (
                  <Fragment key={ `wellness-rating${j}` }>
                    { j === 5 ? (
                      <>
                        <td 
                          className={ styles.bessi_assessment_td }
                          style={{ textAlign: 'left' }}
                        >
                          <span className={ `text1` }>
                            { `${i + 1}. ${obj.activity}` }
                          </span>
                        </td>
                      </>
                    ) : (
                      <>  
                        <td className={ styles.bessi_assessment_td }>
                          <input
                            required={ true }
                            name={ `${i}-${obj.activity}` }
                            type='radio'
                            value={ rating }
                            onChange={ (e: any) => onChange(e, i) }
                          />
                        </td>
                      </>
                    )}
                  </Fragment>
                )) }
              </tr>
            </Fragment>
          )) }
        </tbody>
      </table>
      <br />
    </>
  )
}

export default TableRadioInput