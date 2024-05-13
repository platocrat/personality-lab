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
const PAGE_FRAGMENT_ID = `spend-time-with-others`
const QUESTION_TITLE = `Here are a number of characteristics that may or may not apply to you. For example, do you agree that you are someone who likes to spend time with others? Please indicate the extent to which you agree or disagree with each statement. I am someone who...`



type SpendTimeWithOthersFormProps = { }




const SpendTimeWithOthersForm: FC<SpendTimeWithOthersFormProps> = ({  }) => {
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
                    `${ GENDER_AND_CREATIVITY_FRAGMENT_ID_PREFACE }-${ PAGE_FRAGMENT_ID }-question-bank-legend-item-${ i }` 
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
            { questionBank.spendTimeWithOthers.map(
                (question: string, i: number) => (
                <Fragment 
                  key={ 
                    `${ GENDER_AND_CREATIVITY_FRAGMENT_ID_PREFACE }-${ PAGE_FRAGMENT_ID }-question-item-${ i }` 
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


export default SpendTimeWithOthersForm