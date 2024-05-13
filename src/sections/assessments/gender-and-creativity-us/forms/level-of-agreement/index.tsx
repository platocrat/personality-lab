// Externals
import { FC, Fragment } from 'react'
// Locals
import {
  questionBank,
  questionBankLegend,
  GENDER_AND_CREATIVITY_FRAGMENT_ID_PREFACE,
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const BUTTON_TEXT = `Next`
const PAGE_FRAGMENT_ID = `level-of-agreement`
const QUESTION_TITLE = `Please indicate your level of agreement to the following statements using the options provided`



type LevelOfAgreementFormProps = {}



/**
 * @todo Merge this component with `SpendTimeWithOthersForm` in to a single 
 * component because they are the exact same
 */
const LevelOfAgreementForm: FC<LevelOfAgreementFormProps> = ({ }) => {
  return (
    <>
      <div>
        <form>

          <div>
            { QUESTION_TITLE }
          </div>

          <div>
            { questionBankLegend.map(
              (level: string, i: number) => (
                <Fragment
                  key={
                    `${ GENDER_AND_CREATIVITY_FRAGMENT_ID_PREFACE }-${ PAGE_FRAGMENT_ID }-question-bank-legend-item-${i}`
                  }
                >
                  <div>
                    { level }
                  </div>
                </Fragment>
              ))
            }
          </div>

          <div>
            { questionBank.levelOfAgreement.map(
              (question: string, i: number) => (
                <Fragment
                  key={
                    `${ GENDER_AND_CREATIVITY_FRAGMENT_ID_PREFACE }-${ PAGE_FRAGMENT_ID }-question-item-${i}`
                  }
                >
                  <div>
                    { question }
                  </div>
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


export default LevelOfAgreementForm