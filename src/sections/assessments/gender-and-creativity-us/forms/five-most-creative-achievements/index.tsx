// Externals
import { FC, Fragment, useState } from 'react'
// Locals
import TextOrNumberInput from '@/components/Input/TextOrNumber'
import CreativityAndAchievementsForm from '@/components/Forms/GenderAndCreativityUs/CreativityAndAchievements'
// Utils
import { GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF, GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE } from '@/utils'
// CSS
import styles from '@/app/page.module.css'



const href = `${GENDER_AND_CREATIVITY_US_ASSESSMENT_HREF}/creative-activities-and-achievements/task-enjoyment`

const BUTTON_TEXT = `Next`
const QUESTION_TEXT = ` Please name your overall five most creative achievements in your life so far.Select those achievements that you think will help someone else to evaluate your actual creativity.Your responses can come from domains other than those captured by the previous inventory.Start by naming your most creative achievement, then your second - most creative achievement, and so on.Describe each achievement by writing a brief sentence in the boxes below.If there are fewer than five relevant achievements, just leave the remaining boxes empty.`



type FiveMostCreativeAchievementsFormProps = {}



const FiveMostCreativeAchievementsForm: FC<FiveMostCreativeAchievementsFormProps> = ({ }) => {
  const [ creativeAchievements, setCreativeAchievements ] = useState<any>({})


  function onCreativeAchievementChange(e: any, itemIndex: number) {
    const _ = e.target.value

    setCreativeAchievements({
      ...creativeAchievements,
      [ `${ itemIndex }` ]: _
    })
  }


  
  return (
    <>
      <div>
        <div>
          <p>
            { QUESTION_TEXT }
          </p>
        </div>

        <div>
          { [1, 2, 3, 4, 5].map((_, i: number) => (
            <Fragment
              key={ `${GENDER_AND_CREATIVITY_US_FRAGMENT_ID_PREFACE}-five-most-creative-achievements-${ i }` }
            >
              {/* <TextOrNumberInput
                onChange={ (e: any) => onCreativeAchievementChange(e, _) }
              /> */}
            </Fragment>
          )) }
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
      </div>
    </>
  )
}


export default FiveMostCreativeAchievementsForm